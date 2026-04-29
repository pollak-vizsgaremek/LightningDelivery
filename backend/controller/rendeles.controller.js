import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { setOrderStatus } from "../server/orderStatusStore.js";
import { sendOrderSuccessEmail } from "../server/nodemailer.js";

const prisma = new PrismaClient();

const router = Router();

router.post("/rendelesleadas", async (req, res) => {
  const data = req.body;
  const tokenUserId = Number(req.user?.id);
  const FelhasznalokID = Number(data.FelhasznalokID ?? tokenUserId);

  if (!Number.isInteger(FelhasznalokID)) {
    return res.status(400).json({ message: "Hibás rendelési adatok." });
  }

  const rawItems = Array.isArray(data.items)
    ? data.items
    : [
        {
          foodId: data.EtelekID,
          drinkId: data.ItalokID,
          menuId: data.MenuID,
          quantity: data.Mennyiseg,
        },
      ];

  const normalizedItems = rawItems
    .map((item) => ({
      foodId: Number(item?.foodId ?? item?.EtelekID),
      drinkId: Number(item?.drinkId ?? item?.ItalokID),
      menuId: Number(item?.menuId ?? item?.MenuID),
      quantity: Math.min(
        10,
        Math.max(1, Number(item?.quantity ?? item?.Mennyiseg ?? 1)),
      ),
      type: String(item?.type ?? "Tétel"),
      label: String(item?.label ?? ""),
      price: Number(item?.price ?? 0),
    }))
    .filter(
      (item) => Number.isInteger(item.foodId) && Number.isInteger(item.drinkId),
    );

  if (normalizedItems.length === 0) {
    return res
      .status(400)
      .json({ message: "A kosár nem tartalmaz rendelhető tételt." });
  }

  try {
    // A jelenlegi sémában rendelés -> kosár + kosár_tétel tárolásban történik.
    const [lastCart, lastCartItem] = await Promise.all([
      prisma.kosarak.findFirst({
        orderBy: { ID: "desc" },
        select: { ID: true },
      }),
      prisma.kosar_tetelek.findFirst({
        orderBy: { ID: "desc" },
        select: { ID: true },
      }),
    ]);

    const nextCartId = (lastCart?.ID ?? 0) + 1;
    const nextCartItemId = (lastCartItem?.ID ?? 0) + 1;

    const now = new Date();

    await prisma.kosarak.create({
      data: {
        ID: nextCartId,
        FelhasznaloID: FelhasznalokID,
        Elkeszult: now,
        Modositott: now,
      },
    });

    const orderLineRows = [];
    const emailItems = [];

    for (let index = 0; index < normalizedItems.length; index += 1) {
      const entry = normalizedItems[index];
      let menuId = Number.isInteger(entry.menuId) ? entry.menuId : 0;

      if (!menuId) {
        const food = await prisma.etelek.findUnique({
          where: { ID: entry.foodId },
          select: { EtteremID: true, Nev: true, Ar: true },
        });

        if (food?.EtteremID) {
          const fallbackMenu = await prisma.menuk.findFirst({
            where: { EttermekID: food.EtteremID },
            select: { ID: true },
          });
          menuId = fallbackMenu?.ID ?? 0;
        }
      }

      if (!menuId) {
        return res.status(400).json({
          message: `Nem található érvényes menü a(z) ${index + 1}. tételhez.`,
        });
      }

      const [orderedFood, orderedDrink, orderedMenu] = await Promise.all([
        prisma.etelek.findUnique({
          where: { ID: entry.foodId },
          select: { Nev: true, Ar: true },
        }),
        prisma.italok.findUnique({
          where: { ID: entry.drinkId },
          select: { Nev: true, Ar: true },
        }),
        prisma.menuk.findUnique({
          where: { ID: menuId },
          select: {
            MenuNev: true,
            MenuAr: true,
            AkciosE: true,
            AkciosAr: true,
          },
        }),
      ]);

      orderLineRows.push({
        ID: nextCartItemId + index,
        KosarID: nextCartId,
        EtelekID: entry.foodId,
        ItalokID: entry.drinkId,
        MenuID: menuId,
        Mennyiseg: entry.quantity,
      });

      emailItems.push({
        type: entry.type,
        name:
          entry.label ||
          orderedMenu?.MenuNev ||
          orderedFood?.Nev ||
          orderedDrink?.Nev ||
          `Tétel #${index + 1}`,
        price:
          entry.price ||
          Number(
            (orderedMenu?.AkciosE
              ? orderedMenu?.AkciosAr
              : orderedMenu?.MenuAr) ??
              orderedFood?.Ar ??
              orderedDrink?.Ar ??
              0,
          ),
        quantity: entry.quantity,
      });
    }

    await prisma.kosar_tetelek.createMany({
      data: orderLineRows,
    });

    await setOrderStatus(nextCartId, "UJ");

    const user = await prisma.felhasznalok.findUnique({
      where: { ID: FelhasznalokID },
      select: {
        Email: true,
        Felhasznalonev: true,
      },
    });

    const paymentMethodMap = {
      cash: "Készpénz",
      card: "Bankkártya",
      transfer: "Átutalás",
    };
    const paymentMethod =
      paymentMethodMap[String(data.FizetesiMod ?? "")] ??
      String(data.FizetesiMod ?? "Nincs megadva");

    try {
      await sendOrderSuccessEmail({
        email: user?.Email,
        userName: user?.Felhasznalonev,
        orderId: nextCartId,
        quantity: normalizedItems.reduce((sum, item) => sum + item.quantity, 0),
        items: emailItems,
        address: String(data.Cime ?? ""),
        paymentMethod,
      });
    } catch (mailError) {
      console.error(
        "Rendelés visszaigazoló email küldése sikertelen:",
        mailError,
      );
    }

    res.status(201).json({ message: "Rendelés sikeresen hozzáadva" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Szerver hiba" });
  }
});

router.get("/rendeles", async (_, res) => {
  const data = await prisma.kosarak.findMany({
    include: {
      kosar_tetelek: {
        include: {
          etelek: true,
          italok: true,
          menuk: true,
        },
      },
    },
    orderBy: { ID: "desc" },
  });
  res.status(200).json(data);
});

router.delete("/rendeles/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const cartId = Number(id);

    await prisma.$transaction([
      prisma.kosar_tetelek.deleteMany({
        where: { KosarID: cartId },
      }),
      prisma.kosarak.delete({
        where: { ID: cartId },
      }),
    ]);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).send("Nem sikerült törölni");
  }
});

export default router;
