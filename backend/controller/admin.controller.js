import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  getOrderStatuses,
  setOrderStatus,
} from "../server/orderStatusStore.js";

const router = Router();
const prisma = new PrismaClient();
const ALLOWED_ORDER_STATUSES = [
  "UJ",
  "ELFOGADVA",
  "ELKESZITES",
  "KISZALLITAS_ALATT",
  "TELJESITVE",
  "SIKERTELEN",
];

const requireAdmin = (req, res, next) => {
  const role = String(req.user?.role ?? "").toUpperCase();

  if (role === "ADMIN") {
    return next();
  }

  return res.status(403).json({ error: "Ehhez admin jogosultság kell." });
};

router.get("/bootstrap", requireAdmin, async (_, res) => {
  try {
    const [
      users,
      menus,
      restaurants,
      foods,
      drinks,
      orders,
      cities,
      restaurantTypes,
    ] = await Promise.all([
      prisma.felhasznalok.findMany({
        orderBy: { ID: "asc" },
        select: {
          ID: true,
          Felhasznalonev: true,
          Email: true,
          Jogosultsag: true,
        },
      }),
      prisma.menuk.findMany({
        orderBy: { ID: "asc" },
        include: {
          ettermek: {
            select: {
              ID: true,
              EtteremNev: true,
            },
          },
        },
      }),
      prisma.ettermek.findMany({
        orderBy: { EtteremNev: "asc" },
        include: {
          varosok: {
            select: {
              ID: true,
              VarosNev: true,
            },
          },
          etteremtipus: {
            select: {
              ID: true,
              EtteremTipus: true,
            },
          },
        },
      }),
      prisma.etelek.findMany({
        orderBy: { Nev: "asc" },
        select: {
          ID: true,
          Nev: true,
          EtteremID: true,
        },
      }),
      prisma.italok.findMany({
        orderBy: { Nev: "asc" },
        select: {
          ID: true,
          Nev: true,
          EtteremID: true,
        },
      }),
      prisma.kosarak.findMany({
        orderBy: { ID: "desc" },
        include: {
          kosar_tetelek: {
            include: {
              etelek: true,
              italok: true,
              menuk: true,
            },
          },
        },
      }),
      prisma.varosok.findMany({
        orderBy: { VarosNev: "asc" },
        select: {
          ID: true,
          VarosNev: true,
        },
      }),
      prisma.etteremtipus.findMany({
        orderBy: { EtteremTipus: "asc" },
        select: {
          ID: true,
          EtteremTipus: true,
        },
      }),
    ]);

    const orderStatuses = await getOrderStatuses(
      (orders ?? []).map((order) => order.ID),
    );
    const ordersWithStatus = (orders ?? []).map((order) => ({
      ...order,
      Allapot: orderStatuses[String(order.ID)] ?? "UJ",
    }));

    res.status(200).json({
      users,
      menus,
      restaurants,
      foods,
      drinks,
      orders: ordersWithStatus,
      cities,
      restaurantTypes,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Nem sikerült betölteni az admin adatokat." });
  }
});

router.patch("/restaurants/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { EtteremNev, AtlagosSzallitasiIdo, VarosID, EtteremTipusID } =
      req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Érvénytelen étterem azonosító." });
    }

    await prisma.ettermek.update({
      where: { ID: id },
      data: {
        ...(EtteremNev !== undefined ? { EtteremNev: String(EtteremNev) } : {}),
        ...(AtlagosSzallitasiIdo !== undefined
          ? { AtlagosSzallitasiIdo: Number(AtlagosSzallitasiIdo) }
          : {}),
        ...(VarosID !== undefined ? { VarosID: Number(VarosID) } : {}),
        ...(EtteremTipusID !== undefined
          ? { EtteremTipusID: Number(EtteremTipusID) }
          : {}),
      },
    });

    return res.status(200).json({ message: "Étterem sikeresen módosítva." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Nem sikerült az étterem módosítása." });
  }
});

router.delete("/restaurants/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Érvénytelen étterem azonosító." });
    }

    await prisma.ettermek.delete({
      where: { ID: id },
    });

    return res.status(200).json({ message: "Étterem törölve." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Nem sikerült az étterem törlése." });
  }
});

router.get("/orders", async (_, res) => {
  try {
    const orders = await prisma.kosarak.findMany({
      orderBy: { ID: "desc" },
      include: {
        kosar_tetelek: {
          include: {
            etelek: true,
            italok: true,
            menuk: true,
          },
        },
      },
    });

    const orderStatuses = await getOrderStatuses(
      (orders ?? []).map((order) => order.ID),
    );
    const ordersWithStatus = (orders ?? []).map((order) => ({
      ...order,
      Allapot: orderStatuses[String(order.ID)] ?? "UJ",
    }));

    return res.status(200).json(ordersWithStatus);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Nem sikerült lekérni a rendeléseket." });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body?.Allapot ?? "").toUpperCase();

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Érvénytelen rendelés azonosító." });
    }

    if (!ALLOWED_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Érvénytelen rendelés állapot." });
    }

    const orderExists = await prisma.kosarak.findUnique({
      where: { ID: id },
      select: { ID: true },
    });

    if (!orderExists) {
      return res.status(404).json({ error: "A rendelés nem található." });
    }

    await setOrderStatus(id, status);

    return res
      .status(200)
      .json({ message: "Rendelés állapota mentve.", Allapot: status });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Nem sikerült menteni a rendelés állapotát." });
  }
});

router.post("/orders", requireAdmin, async (req, res) => {
  try {
    const { FelhasznaloID, EtelekID, ItalokID, MenuID, Mennyiseg } = req.body;

    if (
      !FelhasznaloID ||
      !EtelekID ||
      !ItalokID ||
      !MenuID ||
      !Mennyiseg ||
      Number(Mennyiseg) < 1
    ) {
      return res
        .status(400)
        .json({ error: "Minden rendelés mező kitöltése kötelező." });
    }

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
        FelhasznaloID: Number(FelhasznaloID),
        Elkeszult: now,
        Modositott: now,
      },
    });

    await prisma.kosar_tetelek.create({
      data: {
        ID: nextCartItemId,
        KosarID: nextCartId,
        EtelekID: Number(EtelekID),
        ItalokID: Number(ItalokID),
        MenuID: Number(MenuID),
        Mennyiseg: Number(Mennyiseg),
      },
    });

    return res.status(201).json({ message: "Rendelés sikeresen felvéve." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Nem sikerült rendelést létrehozni." });
  }
});

router.patch("/menus/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { MenuNev, MenuAr, AkciosE, AkciosAr } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Érvénytelen menü azonosító." });
    }

    await prisma.menuk.update({
      where: { ID: id },
      data: {
        ...(MenuNev !== undefined ? { MenuNev: String(MenuNev) } : {}),
        ...(MenuAr !== undefined ? { MenuAr: Number(MenuAr) } : {}),
        ...(AkciosE !== undefined ? { AkciosE: Boolean(AkciosE) } : {}),
        ...(AkciosAr !== undefined ? { AkciosAr: Number(AkciosAr) } : {}),
      },
    });

    return res.status(200).json({ message: "Menü sikeresen módosítva." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Nem sikerült a menü módosítása." });
  }
});

router.patch("/users/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { Jogosultsag } = req.body;

    if (Number.isNaN(id) || !Jogosultsag) {
      return res.status(400).json({ error: "Hibás felhasználó adat." });
    }

    await prisma.felhasznalok.update({
      where: { ID: id },
      data: {
        Jogosultsag: String(Jogosultsag),
      },
    });

    return res
      .status(200)
      .json({ message: "Felhasználó sikeresen módosítva." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Nem sikerült a felhasználó módosítása." });
  }
});

router.delete("/users/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ error: "Érvénytelen felhasználó azonosító." });
    }

    await prisma.felhasznalok.delete({
      where: { ID: id },
    });

    return res.status(200).json({ message: "Felhasználó törölve." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Nem sikerült a felhasználó törlése." });
  }
});

export default router;
