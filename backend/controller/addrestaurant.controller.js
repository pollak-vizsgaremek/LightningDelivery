import { Router } from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/ujetterem", upload.single("image"), async (req, res) => {
  const data = req.body;

  try {
    if (!req.file) {
      return res.status(400).send("Nem érkezett fájl.");
    }
    console.log(data);

    await prisma.ettermek.create({
      data: {
        EtteremNev: data.EtteremNev,
        EtteremKep: req.file.buffer,
        EtteremTipusID: data.EtteremTipusID,
        AtlagosSzallitasiIdo: Number(data.AtlagosSzallitasiIdo),
        VarosID: parseInt(data.VarosID),
        Longitude: parseFloat(data.Longitude),
        Latitude: parseFloat(data.Latitude),
      },
    });
    res.status(200).send("Sikeres hozzáadás");
  } catch (error) {
    console.error(error);
    res.status(500).send("Hiba történt mentés közben.");
  }
});

export default router;
