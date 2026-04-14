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

test("POST /api/register should return all test model data", async () => {
  const mockCredentials = {
    email: "admin@localhost.local",
    password: "admin123",
  };

  const response = (await request(app).post("/api/register"))
    .setEncoding(mockCredentials)
    .expect(200);

  expect(response.body).toEqual({ messege: "Register successful" });
});


//regiter, login, kártya visszaadása, rendelés leadás, rendelés elkészités, rendelés törlése, 