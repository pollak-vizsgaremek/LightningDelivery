import e from "express";
import { PrismaClient } from "./generated/prisma/client.js";
import bcrypt from "bcrypt"

const app = e();
const prisma = new PrismaClient();

app.use(e.json());

app.get("/api/rendeles", async (_, res) => {
  const data = await prisma.rendeles.findMany();
  res.status(200).json(data);
});

app.post("/api/regisztracio", async (req, res) => {
  const data = req.body;
  const hashedPassword = bcrypt.hashSync(data.Jelszo, 10);

  try {
    await prisma.felhasznalok.create({
      data: {
        Email: data.Email,
        Felhasznalonev: data.Felhasznalonev,
        Jelszo: hashedPassword,
      },
    });
    res.status(201).send("Sikeres regisztráció");
  } catch(error) {
    console.error(error)
    res.status(500).send("Szerver hiba");
  }
});

app.post("/api/rendelesleadas", async (req, res) => {
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
    console.error(error)
    res.status(500).send("Szerver hiba");
  }
});

app.delete("/api/rendeles/:id", async (req, res) => {
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

app.listen(3300, () => {
  console.log("Elindult http://localhost:3300");
});
