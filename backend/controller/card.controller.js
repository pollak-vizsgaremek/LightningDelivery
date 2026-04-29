import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

const withRestaurantImage = async (restaurant) => {
  let finalValue = null;

  if (
    restaurant.EtteremLancID &&
    restaurant.etteremlancok?.preset_kepek?.length > 0
  ) {
    const kepek = restaurant.etteremlancok.preset_kepek;
    const randomIndex = Math.floor(Math.random() * kepek.length);
    finalValue = Buffer.from(kepek[randomIndex].EtteremKep).toString("base64");
  } else {
    const randomPresetId = Math.floor(Math.random() * 3) + 1;
    const pic = await prisma.preset_kepek.findFirst({
      where: {
        ID: randomPresetId,
      },
    });

    if (pic?.EtteremKep) {
      finalValue = Buffer.from(pic.EtteremKep).toString("base64");
    }
  }

  return {
    ...restaurant,
    EtteremKep: finalValue,
  };
};

router.get("/ettermek", async (_, res) => {
  try {
    const restaurants = await prisma.ettermek.findMany({
      include: {
        varosok: true,
        etteremtipus: true,
        menuk: true,
        etteremlancok: {
          include: { preset_kepek: true },
        },
      },
    });

    const restaurantsWithBase64 = await Promise.all(
      restaurants.map((restaurant) => withRestaurantImage(restaurant)),
    );

    res.status(200).json(restaurantsWithBase64);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/ettermek/tipus/:tipusId", async (req, res) => {
  try {
    const tipusId = Number(req.params.tipusId);

    if (Number.isNaN(tipusId)) {
      return res
        .status(400)
        .json({ error: "Érvénytelen étteremtípus azonosító." });
    }

    const restaurants = await prisma.ettermek.findMany({
      where: {
        EtteremTipusID: tipusId,
      },
      include: {
        varosok: true,
        etteremtipus: true,
        menuk: true,
        etteremlancok: {
          include: { preset_kepek: true },
        },
      },
    });

    const restaurantsWithBase64 = await Promise.all(
      restaurants.map((restaurant) => withRestaurantImage(restaurant)),
    );

    return res.status(200).json(restaurantsWithBase64);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/ettermek/:id/reszletek", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Érvénytelen étterem azonosító." });
    }

    const restaurant = await prisma.ettermek.findUnique({
      where: { ID: id },
      include: {
        varosok: true,
        etteremtipus: true,
        etteremlancok: {
          include: { preset_kepek: true },
        },
        etelek: true,
        italok: true,
        menuk: {
          include: {
            menu_etelek: {
              include: {
                etelek: true,
              },
            },
            menu_italok: {
              include: {
                italok: true,
              },
            },
          },
        },
      },
    });

    if (!restaurant) {
      return res.status(404).json({ error: "Az étterem nem található." });
    }

    const restaurantWithImage = await withRestaurantImage(restaurant);

    return res.status(200).json(restaurantWithImage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
