import e from "express";
import { PrismaClient } from "./generated/prisma/client.js";

const app = e();
const prisma = new PrismaClient();


app.use(e.json());


app.listen(3300, () => {
  console.log("Elindult");
});

