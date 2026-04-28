import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/ettermek", async (_, res) => {
  const restaurants = await prisma.ettermek.findMany({
    include: {
      varosok: true,
      etteremtipus: true,
    },
  });

  // Konvertáld a bináris képeket base64-re
  const restaurantsWithBase64 = restaurants.map((restaurant) => ({
    ...restaurant,
    EtteremKep: restaurant.EtteremKep
      ? Buffer.from(restaurant.EtteremKep).toString("base64")
      : null,
  }));

  res.status(200).json(restaurantsWithBase64);
});

// Szűrés étteremtípus alapján
router.get("/ettermek/tipus/:tipusId", async (req, res) => {
  const { tipusId } = req.params;
  
  const restaurants = await prisma.ettermek.findMany({
    where: {
      EtteremTipusID: parseInt(tipusId),
    },
    include: {
      varosok: true,
      etteremtipus: true,
    },
  });

  // Konvertáld a bináris képeket base64-re
  const restaurantsWithBase64 = restaurants.map((restaurant) => ({
    ...restaurant,
    EtteremKep: restaurant.EtteremKep
      ? Buffer.from(restaurant.EtteremKep).toString("base64")
      : null,
  }));

  res.status(200).json(restaurantsWithBase64);
});

// Összes étteremtípus lekérése
router.get("/etteremtipusok", async (_, res) => {
  const tipusok = await prisma.etteremtipus.findMany();
  res.status(200).json(tipusok);
});

router.get("/etelek", async (_, res) => {
  const etelek = await prisma.etelek.findMany();

  res.status(200).json(etelek);
});

router.get("/menuk", async (_, res) => {
  const data = await prisma.menuk.findMany({
    include: {
      ettermek: true,
      menu_etelek: true,
      menu_italok: true,
    },
  });
  res.status(200).json(data);
});

export default router;
