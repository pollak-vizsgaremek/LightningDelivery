import app from "../index.js";
import request from "supertest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Auth Controller", () => {
  afterEach(async () => {
    // Clean up test data
    await prisma.felhasznalok.deleteMany({
      where: {
        Email: {
          in: ["test@localhost.local", "existing@localhost.local"],
        },
      },
    });
  });

  describe("POST /api/register", () => {
    test("should register a new user successfully", async () => {
      const newUser = {
        Felhasznalonev: "testuser",
        Email: "test@localhost.local",
        Jelszo: "password123",
        Jelszo2: "password123",
      };

      const response = await request(app)
        .post("/api/register")
        .send(newUser)
        .expect(201);

      expect(response.text).toBe("Sikeres regisztráció");
    });

    test("should fail if required fields are missing", async () => {
      const incompleteUser = {
        Felhasznalonev: "testuser",
        Email: "test@localhost.local",
        Jelszo: "password123",
      };

      const response = await request(app)
        .post("/api/register")
        .send(incompleteUser)
        .expect(400);

      expect(response.body.message).toBe("Minden mező kitöltése kötelező!");
    });

    test("should fail if passwords do not match", async () => {
      const mismatchedPasswords = {
        Felhasznalonev: "testuser",
        Email: "test@localhost.local",
        Jelszo: "password123",
        Jelszo2: "password456",
      };

      const response = await request(app)
        .post("/api/register")
        .send(mismatchedPasswords)
        .expect(400);

      expect(response.body.message).toBe("A jelszavak nem egyeznek!");
    });

    test("should fail if email already exists", async () => {
      const user = {
        Felhasznalonev: "testuser1",
        Email: "existing@localhost.local",
        Jelszo: "password123",
        Jelszo2: "password123",
      };

      // Create first user
      await request(app).post("/api/register").send(user);

      // Try to create another user with same email
      const response = await request(app)
        .post("/api/register")
        .send({
          ...user,
          Felhasznalonev: "testuser2",
        })
        .expect(400);

      expect(response.body.message).toBe("Az email már foglalt!");
    });
  });

  describe("POST /api/login", () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await request(app)
        .post("/api/register")
        .send({
          Felhasznalonev: "logintest",
          Email: "login@localhost.local",
          Jelszo: "password123",
          Jelszo2: "password123",
        });
    });

    test("should login successfully with correct credentials", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          Email: "login@localhost.local",
          Jelszo: "password123",
        })
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.userId).toBeDefined();
      expect(response.body.userName).toBe("logintest");
    });

    test("should fail if email is missing", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          Jelszo: "password123",
        })
        .expect(400);

      expect(response.body.message).toBe("Email és jelszó megadása kötelező!");
    });

    test("should fail if password is missing", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          Email: "login@localhost.local",
        })
        .expect(400);

      expect(response.body.message).toBe("Email és jelszó megadása kötelező!");
    });

    test("should fail with incorrect password", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          Email: "login@localhost.local",
          Jelszo: "wrongpassword",
        })
        .expect(401);

      expect(response.body.message).toBe("Hibás email vagy jelszó!");
    });

    test("should fail with non-existent email", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          Email: "nonexistent@localhost.local",
          Jelszo: "password123",
        })
        .expect(401);

      expect(response.body.message).toBe("Hibás email vagy jelszó!");
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
