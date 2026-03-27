import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

router.post("/rendelesleadas", async (req, res) => {
  const data = req.body;

  try {
    await prisma.rendeles.create({
      data: {
        EtelekID: data.EtelekID,
        ItalokID: data.ItalokID,
        FelhasznalokID: data.FelhasznalokID,
      },
    });

    res.status(201).send("Rendelés sikeresen hozzáadva");
  } catch (error) {
    console.error(error);
    res.status(500).send("Szerver hiba");
  }
});

router.get("/rendeles", async (_, res) => {
  const data = await prisma.rendeles.findMany();
  res.status(200).json(data);
});

router.delete("/rendeles/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await prisma.rendeles.delete({
      where: {
        ID: Number(id),
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).send("Nem sikerült törölni");
  }
});

export default router;
