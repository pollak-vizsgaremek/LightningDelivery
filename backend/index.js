import e from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";
import userController from "./controller/user.controller.js";
import authMiddleware from "./middleware/auth.middleware.js";
import authController from "./controller/auth.controller.js";
import rendelesController from "./controller/rendeles.controller.js";

const app = e();
const prisma = new PrismaClient();

app.use(e.json());

// login és register

app.use("/api/v1/users", authMiddleware, userController);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use("/api/v1/auth", authController);

app.use("/api/v1", rendelesController);

app.listen(3300, () => {
  console.log("Elindult http://localhost:3300");
});
