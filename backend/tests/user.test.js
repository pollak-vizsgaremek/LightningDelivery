import app from "../index.js";
import request from "supertest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("User Controller", () => {
  describe("GET /api/", () => {
    test("should return all users", async () => {
      const response = await request(app)
        .get("/api/")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    test("should return users with expected properties", async () => {
      const response = await request(app)
        .get("/api/")
        .expect(200);

      if (response.body.length > 0) {
        const user = response.body[0];
        expect(user).toHaveProperty("ID");
        expect(user).toHaveProperty("Email");
        expect(user).toHaveProperty("Felhasznalonev");
      }
    });

    test("should return status 200 for valid request", async () => {
      const response = await request(app).get("/api/");

      expect(response.status).toBe(200);
    });

    test("should return JSON content type", async () => {
      const response = await request(app).get("/api/");

      expect(response.type).toBe("application/json");
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
