import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/ettermek", async (_, res) => {
  try {
    const restaurants = await prisma.ettermek.findMany({
      include: {
        varosok: true,
        etteremtipus: true,
        etteremlancok: {
          include: { preset_kepek: true },
        },
      },
    });

    const restaurantsWithBase64 = restaurants.map((restaurant), async () => {
      let finalValue = null;

      // Case 1: Restaurant belongs to a chain
      if (restaurants.EtteremLancID && restaurant.etteremlancok?.preset_kepek?.length > 0) {
        const kepek = restaurant.etteremlancok.preset_kepek;
        const randomIndex = Math.floor(Math.random() * kepek.length);
        finalValue = Buffer.from(kepek[randomIndex].EtteremKep).toString("base64");
      } 
      // Case 2: No chain (EtteremLancID is null)
      else {
        finalValue = Math.floor(Math.random() * 3) + 1;

        const pic = await prisma.preset_kepek.findFirst({
          where: {
            ID: finalValue
          }
        })

      }
      console.log(finalValue);


      
      return {
        ...restaurant,
        EtteremKep: finalValue,
      };
    });

    res.status(200).json(restaurantsWithBase64);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
