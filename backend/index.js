import e from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// Controllerek
import authController from "./controller/auth.controller.js";
import userController from "./controller/user.controller.js";
import rendelesController from "./controller/rendeles.controller.js";
import cardController from "./controller/card.controller.js";
import filterController from "./controller/filter.controller.js";
import cityController from "./controller/city.controller.js";
import addRestaurant from "./controller/addrestaurant.controller.js";

// Middleware-ek
import authMiddleware from "./middleware/auth.middleware.js";
import { isAdmin } from "./middleware/admin.middleware.js";

const app = e();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(e.json());
app.use(cors());


// NYILVÁNOS ÚTVONALAK
app.use("/api/v1/auth", authController);
app.use("/api/v1", cardController);
app.use("/api/v1", filterController);
app.use("/api/v1", cityController);

// CSAK ADMIN ÚTVONALAK
// Sorrend: 1. Token ellenőrzés -> 2. Admin rang ellenőrzés -> 3. Controller
app.use("/api/v1/users", authMiddleware, isAdmin, userController);
app.use("/api/v1/add-restaurant", authMiddleware, isAdmin, addRestaurant);

// BEJELENTKEZETT ÚTVONALAK
app.use("/api/v1/rendelesek", authMiddleware, rendelesController);

app.listen(3300, () => {
  console.log("Szerver fut: http://localhost:3300");
});

export default app;
export { prisma };
