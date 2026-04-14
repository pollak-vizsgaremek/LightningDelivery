import app from "../index.js";
import request from "supertest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Register and Login Tests", () => {
  const testEmail = "register_test@localhost.local";
  const testUsername = "testreguser";
  const testPassword = "testpass123";

  afterEach(async () => {
    // Clean up test user after each test
    await prisma.felhasznalok.deleteMany({
      where: { Email: testEmail },
    });
  });

  describe("Registration", () => {
    test("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/register")
        .send({
          Felhasznalonev: testUsername,
          Email: testEmail,
          Jelszo: testPassword,
          Jelszo2: testPassword,
        })
        .expect(201);

      expect(response.text).toBe("Sikeres regisztráció");

      // Verify user was created in database
      const user = await prisma.felhasznalok.findUnique({
        where: { Email: testEmail },
      });
      expect(user).toBeDefined();
      expect(user.Felhasznalonev).toBe(testUsername);
    });

    test("should fail registration with missing fields", async () => {
      const response = await request(app)
        .post("/api/register")
        .send({
          Felhasznalonev: testUsername,
          Email: testEmail,
        })
        .expect(400);

      expect(response.body.message).toBe("Minden mező kitöltése kötelező!");
    });

    test("should fail registration with mismatched passwords", async () => {
      const response = await request(app)
        .post("/api/register")
        .send({
          Felhasznalonev: testUsername,
          Email: testEmail,
          Jelszo: "password123",
          Jelszo2: "password456",
        })
        .expect(400);

      expect(response.body.message).toBe("A jelszavak nem egyeznek!");
    });

    test("should fail registration with duplicate email", async () => {
      // Create first user
      await request(app)
        .post("/api/register")
        .send({
          Felhasznalonev: testUsername,
          Email: testEmail,
          Jelszo: testPassword,
          Jelszo2: testPassword,
        });

      // Try to register with same email
      const response = await request(app)
        .post("/api/register")
        .send({
          Felhasznalonev: "anotheruser",
          Email: testEmail,
          Jelszo: testPassword,
          Jelszo2: testPassword,
        })
        .expect(400);

      expect(response.body.message).toBe("Az email már foglalt!");
    });
  });

  describe("Login", () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await request(app)
        .post("/api/register")
        .send({
          Felhasznalonev: testUsername,
          Email: testEmail,
          Jelszo: testPassword,
          Jelszo2: testPassword,
        });
    });

    test("should login successfully with correct credentials", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          Email: testEmail,
          Jelszo: testPassword,
        })
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.userId).toBeDefined();
      expect(response.body.userName).toBe(testUsername);
    });

    test("should fail login with incorrect password", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          Email: testEmail,
          Jelszo: "wrongpassword",
        })
        .expect(401);

      expect(response.body.message).toBe("Hibás email vagy jelszó!");
    });

    test("should fail login with missing credentials", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          Email: testEmail,
        })
        .expect(400);

      expect(response.body.message).toBe("Email és jelszó megadása kötelező!");
    });

    test("should fail login with non-existent email", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          Email: "nonexistent@localhost.local",
          Jelszo: testPassword,
        })
        .expect(401);

      expect(response.body.message).toBe("Hibás email vagy jelszó!");
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
