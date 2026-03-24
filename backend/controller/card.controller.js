import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/ettermek", async (_, res) => {
  const restaurants = await prisma.ettermek.findMany();

  res.status(200).json(restaurants);
});


router.get("/menuk", async (_, res) => {
  const cards = await prisma.menuk.findMany();

  res.status(200).json(cards);
});

app.post("/api/kartya", async (req, res) => {
    const data = req.body;

    try {
        await prisma.menuk.create({
            data: {
            EttermekID: Number(data.EttermekID),
            MenuNev: data.kasztId,
            MenuAr: Number(data.datum),
            AkciosAr: Number(data.AkciosAr)
        }
           
    })
         res.status(201).send("Sikeresen hozzáadva")
        
    } catch (error) {
        console.error(error);
        res.status(400).send();
        
    }
    res.status(400).send("Hiányzó adat!")
})

app.get("/api/kasztok", async (req, res) => {
    const data = await prisma.kaszt.findMany();

    res.status(200).json(data)
    
})

export default router