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

  res.status(200).json(restaurants);
});

router.get("/etelek", async (_, res) => {
  const etelek = await prisma.etelek.findMany();

  res.status(200).json(etelek);
});

router.get("/menuk", async (_, res) => {
  const data = await prisma.menuk.findMany({
    include: {
      ettermek: true,
      etelek: true,
      italok: true,
    },
  });
  res.status(200).json(data);
});

export default router;
