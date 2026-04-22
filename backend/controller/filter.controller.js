import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/filterek", async (_, res) => {
  const filterek = await prisma.ettermek.findMany({
    omit: {
        EtteremKep: true
    },
    include: {
      etteremtipus: true,
      varosok: true,
      menuk: {
        include: {
          etelek: true,
          italok: true,
        },
      },
    },
  });
  res.status(200).json(filterek);
});

export default router;
