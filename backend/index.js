import e from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import userController from "./controller/user.controller.js";
import authMiddleware from "./middleware/auth.middleware.js";
import authController from "./controller/auth.controller.js";
import rendelesController from "./controller/rendeles.controller.js";
import cardController from "./controller/card.controller.js";

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

app.use("/api/v1", cardController);

app.listen(3300, () => {
  console.log("Elindult http://localhost:3300");
});

export default app;
export { prisma };
