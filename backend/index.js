import e from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { PrismaClient } from "./generated/prisma/index.js";
import jsonwebtoken from "jsonwebtoken";
import userController from "./controller/user.controller.js";
import authMiddleware from "./middleware/auth.middleware.js";


const app = e();
const prisma = new PrismaClient();

app.use(e.json());
app.use(
  cors({
    origin: "http://localhost:3306",
  })
);


// login és register


app.use("/api/v1/users", authMiddleware, userController);

app.post("/api/v1/auth/register", async (req, res) => {
  const { username, password, password2, email, fullName } = req.body;

  if (!username || !password || !password2 || !email || !fullName)
    return res.status(400).send("Kötelező!");

  if (password !== password2)
    return res.status(400).send("A jelszavak nem egyeznek!");

  const hashedPwd = await bcrypt.hash(password, 12);

  await prisma.users.create({
    data: {
      username,
      email,
      fullName,
      password: hashedPwd,
    },
  });

  res.status(201).send("Siker!");
});


////////////////////////


// rendelések


app.get("/api/rendeles", async (_, res) => {
  const data = await prisma.rendeles.findMany();
  res.status(200).json(data);
});

app.post("/api/rendelesleadas", async (req, res) => {
  const data = req.body;

  try {
    await prisma.rendeles.create({
      data: {
        EtelekID: data.EtelekID,
        ItalokID: data.ItalokID,
      },
    });

    res.status(201).send("Rendelés sikeresen hozzáadva");
  } catch (error) {
    res.status(500).send("Szerver hiba");
  }
});

//////////////////////


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
