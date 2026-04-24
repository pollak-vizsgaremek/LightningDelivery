import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Összes város lekérése
router.get("/cities", async (req, res) => {
  try {
    const cities = await prisma.varosok.findMany({
      select: {
        ID: true,
        VarosNev: true,
        Longitude: true,
        Latitude: true,
      },
      orderBy: {
        VarosNev: "asc",
      },
    });
    res.json(cities);
  } catch (error) {
    console.error("Hiba a városok betöltésekor:", error);
    res.status(500).json({ error: "Szerver hiba" });
  }
});

export default router;