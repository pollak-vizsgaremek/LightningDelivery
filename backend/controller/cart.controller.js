import { application, Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/cart", async (req, res) => {
  try {
    const userId = req.body;

    const cartItems = await prisma.kosarak.findMany({
        include: {
            kosar_tetelek: true,
        },
        where: {
            FelhasznaloID: userId,
        },
    });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).send("Szerver hiba!");
    console.log(error);
  }
});

router.post("/cart", async (req, res) => {
  const { FelhasznaloID, TermekID, Mennyiseg } = req.body;
  try {
    const newCartItem = await prisma.kosarak.create({
      data: {
        FelhasznaloID: FelhasznaloID,
        TermekID: TermekID,
        Mennyiseg: Mennyiseg,
      }
    });
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).send("Szerver hiba!");
    console.log(error);
    
  }
});

router.delete("/cart/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.kosarak.delete({
      where: {
        ID: parseInt(id)
      }
    });
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).send("Szerver hiba!");
    console.log(error);
  }
});

export default router;