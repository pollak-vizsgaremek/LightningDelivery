import app from "../index.js";
import request from "supertest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Rendeles Controller", () => {
  let orderId;
  let testUserId;
  let testEtelId;
  let testItalId;

  beforeAll(async () => {
    // Get test data IDs from database
    const user = await prisma.felhasznalok.findFirst();
    const etel = await prisma.etelek.findFirst();
    const ital = await prisma.italok.findFirst();

    if (user) testUserId = user.ID;
    if (etel) testEtelId = etel.ID;
    if (ital) testItalId = ital.ID;
  });

  describe("POST /api/rendelesleadas", () => {
    test("should create a new order successfully", async () => {
      if (!testUserId || !testEtelId) {
        console.log("Skipping test - required test data not found");
        return;
      }

      const newOrder = {
        EtelekID: testEtelId,
        ItalokID: testItalId || null,
        FelhasznalokID: testUserId,
      };

      const response = await request(app)
        .post("/api/rendelesleadas")
        .send(newOrder)
        .expect(201);

      expect(response.text).toBe("Rendelés sikeresen hozzáadva");
    });

    test("should fail if required fields are missing", async () => {
      const incompleteOrder = {
        EtelekID: testEtelId,
      };

      const response = await request(app)
        .post("/api/rendelesleadas")
        .send(incompleteOrder)
        .expect(500);
    });
  });

  describe("GET /api/rendeles", () => {
    test("should return all orders", async () => {
      const response = await request(app)
        .get("/api/rendeles")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    test("should return orders with expected properties", async () => {
      const response = await request(app)
        .get("/api/rendeles")
        .expect(200);

      if (response.body.length > 0) {
        const order = response.body[0];
        expect(order).toHaveProperty("ID");
        expect(order).toHaveProperty("EtelekID");
        expect(order).toHaveProperty("FelhasznalokID");
      }
    });

    test("should return status 200 for valid request", async () => {
      const response = await request(app).get("/api/rendeles");

      expect(response.status).toBe(200);
    });

    test("should return JSON content type", async () => {
      const response = await request(app).get("/api/rendeles");

      expect(response.type).toBe("application/json");
    });
  });

  describe("DELETE /api/rendeles/:id", () => {
    let orderToDelete;

    beforeEach(async () => {
      if (!testUserId || !testEtelId) {
        console.log("Skipping delete test - required test data not found");
        return;
      }

      // Create an order to delete
      const newOrder = await prisma.rendeles.create({
        data: {
          EtelekID: testEtelId,
          ItalokID: testItalId || undefined,
          FelhasznalokID: testUserId,
        },
      });

      orderToDelete = newOrder;
    });

    test("should delete an order successfully", async () => {
      if (!orderToDelete) {
        console.log("Skipping test - order not created");
        return;
      }

      const response = await request(app)
        .delete(`/api/rendeles/${orderToDelete.ID}`)
        .expect(204);

      // Verify order is deleted
      const deletedOrder = await prisma.rendeles.findUnique({
        where: { ID: orderToDelete.ID },
      });

      expect(deletedOrder).toBeNull();
    });

    test("should fail when deleting non-existent order", async () => {
      const response = await request(app)
        .delete("/api/rendeles/99999")
        .expect(404);

      expect(response.text).toBe("Nem sikerült törölni");
    });

    test("should fail with invalid order ID format", async () => {
      const response = await request(app)
        .delete("/api/rendeles/invalid")
        .expect(404);

      expect(response.text).toBe("Nem sikerült törölni");
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
