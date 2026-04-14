import app from "../index.js";
import request from "supertest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Card Controller", () => {
  describe("GET /api/ettermek", () => {
    test("should return all restaurants", async () => {
      const response = await request(app)
        .get("/api/ettermek")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    test("should return restaurants with expected properties", async () => {
      const response = await request(app)
        .get("/api/ettermek")
        .expect(200);

      if (response.body.length > 0) {
        const restaurant = response.body[0];
        expect(restaurant).toHaveProperty("ID");
        expect(restaurant).toHaveProperty("Nev");
      }
    });
  });

  describe("GET /api/etelek", () => {
    test("should return all foods", async () => {
      const response = await request(app)
        .get("/api/etelek")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    test("should return foods with expected properties", async () => {
      const response = await request(app)
        .get("/api/etelek")
        .expect(200);

      if (response.body.length > 0) {
        const etel = response.body[0];
        expect(etel).toHaveProperty("ID");
        expect(etel).toHaveProperty("Nev");
      }
    });
  });

  describe("GET /api/menuk", () => {
    test("should return all menus", async () => {
      const response = await request(app)
        .get("/api/menuk")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    test("should return menus with etelek and italok relations", async () => {
      const response = await request(app)
        .get("/api/menuk")
        .expect(200);

      if (response.body.length > 0) {
        const menu = response.body[0];
        expect(menu).toHaveProperty("ID");
        expect(menu).toHaveProperty("etelek");
        expect(menu).toHaveProperty("italok");
        expect(Array.isArray(menu.etelek)).toBe(true);
        expect(Array.isArray(menu.italok)).toBe(true);
      }
    });

    test("should return status 200 for valid request", async () => {
      const response = await request(app).get("/api/menuk");

      expect(response.status).toBe(200);
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
