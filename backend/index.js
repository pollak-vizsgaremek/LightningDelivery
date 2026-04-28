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
import authMiddleware from "./middleware/auth.middleware.js"; // Tartsd meg az egyiket
import { isAdmin } from "./middleware/admin.middleware.js";

const app = e();
const prisma = new PrismaClient();

// 1. CORS és JSON - ezek legyenek legfelül
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(e.json());

// 2. NYILVÁNOS ÚTVONALAK (Nem kell token)
app.use("/api/v1/auth", authController); // Itt van a login és register
app.use("/api/v1/cards", cardController);
app.use("/api/v1/filters", filterController);
app.use("/api/v1/cities", cityController);

// 3. CSAK ADMIN ÚTVONALAK
// Sorrend: 1. Token ellenőrzés -> 2. Admin rang ellenőrzés -> 3. Controller
app.use("/api/v1/users", authMiddleware, isAdmin, userController);
app.use("/api/v1/add-restaurant", authMiddleware, isAdmin, addRestaurant);

// 4. BEJELENTKEZETT (USER) ÚTVONALAK
app.use("/api/v1/rendelesek", authMiddleware, rendelesController);

app.listen(3300, () => {
  console.log("Szerver fut: http://localhost:3300");
});

export default app;
export { prisma };
