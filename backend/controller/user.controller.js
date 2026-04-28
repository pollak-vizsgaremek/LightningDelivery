import e from "express";
import { PrismaClient } from "@prisma/client";

const router = e.Router();
const prisma = new PrismaClient();

router.get("/", async (_, res) => {
  const users = await prisma.felhasznalok.findMany();

  res.status(200).json(users);
});

export default router;