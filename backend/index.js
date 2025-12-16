import e from "express";
import { PrismaClient } from "./generated/prisma/client.js";

const app = e();
const prisma = new PrismaClient();

app.use(e.json());

app.get("/api/lightningdelivery", async (req, res) => {
  const data = await prisma.etelek.findMany({
    include: {
        Nev: true,
        Ar: true,
        Kaloria: true,
    },
  });

  res.status(200).json(data);
});

app.post("/api/lightningdelivery", async (req, res) => {
  const data = req.body;

  try {
    await prisma.rendeles.create({
      data: {
        OsszAr: Number(data.OsszAr),
        OsszKaloria: Number(data.OsszKaloria),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).send();
  }
});

app.listen(3300, () => {
  console.log("Elindult");
});
