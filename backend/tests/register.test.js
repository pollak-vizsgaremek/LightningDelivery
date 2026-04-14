import app from "../index.js";
import request from "supertest";

//get-es megoldás

//describe("Register tests", () => {
//  test("GET /api/register should return all test model data", async () => {
//    const res = await request(app).get("/api/register").expect(200);

//    expect(Array.isArray(response.body)).toBe(true);
//  });
//});

//register test

test("POST /api/login should return all test model data", async () => {
  const mockCredentials = {
    email: "admin@localhost.local",
    password: "admin123",
  };

  const response = (await request(app).post("/api/login"))
    .setEncoding(mockCredentials)
    .expect(200);

  expect(response.body).toEqual({ messege: "Register successful" });
  expect(response.body.token).toBeDefined();
});

test("POST /api/register should return all test model data", async () => {
  const mockCredentials = {
    email: "admin@localhost.local",
    password: "admin123",
  };

  const response = (await request(app).post("/api/register"))
    .setEncoding(mockCredentials)
    .expect(200);

  const token = loginResponse.body.token;

  const newRecord = await request(app)
    .post("/api/restModel")
    .send({ field1: "Test", field2: 123, field3: true })
    .expect(201);

  const upadetedRecord = await request(app)
    .put(`/api/testModel/${newRecord.body.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ field1: "Updated test", field2: 456, field3: false })
    .expect(200);

  expect(upadetedRecord.body.field1).toEqual("Updated Test");

  await request(app)
    .delete(`/api/testModel/${newRecord.body.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);
});

//regiter, login, kártya visszaadása, rendelés leadás, rendelés elkészités, rendelés törlése,
