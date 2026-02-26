import e from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { PrismaClient } from "./generated/prisma/index.js";
import jsonwebtoken from "jsonwebtoken";

const app = e();
const prisma = new PrismaClient();

app.use(e.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// login és register

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// register

app.use("/api/v1/users", authMiddleware, userController);

app.post("/api/v1/auth/register", async (req, res) => {
  try {
    const { username, password, password2, email, fullName } = req.body;

    if (!username || !password || !password2 || !email || !fullName)
      return res
        .status(400)
        .json({ message: "Minden mező kitöltése kötelező!" });

    if (password !== password2)
      return res.status(400).json({ message: "A jelszavak nem egyeznek!" });

    // Ellenőrizzük, létezik-e már a felhasználó (Vue-nál fontos a pontos hibaüzenet)
    const letezo = await prisma.users.findUnique({ where: { email } });
    if (letezo)
      return res.status(400).json({ message: "Az email már foglalt!" });

    const hashedPwd = await bcrypt.hash(password, 12);

    await prisma.users.create({
      data: {
        username,
        email,
        fullName,
        password: hashedPwd,
      },
    });

    res.status(201).json({ message: "Sikeres regisztráció!" });
  } catch (error) {
    // ha szerver hiba történik, akkor irtam ide egy catch-et

    res.status(500).json({ message: "Szerver hiba történt!" });
  }
});

// login

app.post("/api/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email és jelszó megadása kötelező!" });

    const user = await prisma.users.findUnique({ where: { email } });

    // BIZTONSÁGOS ELLENŐRZÉS: Ha nincs user, ne dobjon hibát a bcrypt
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jsonwebtoken.sign(
        {
          email: user.email,
          name: user.fullName,
        },
        "secret",
        {
          algorithm: "HS512",
          expiresIn: "1h", // A 15m nagyon rövid teteléshez
          issuer: "http://localhost:5173",
          subject: user.id.toString(),
        },
      );

      return res.status(200).json({
        accessToken,
        userId: user.id,
        userName: user.fullName,
      });
    } else {
      return res.status(401).json({ message: "Hibás email vagy jelszó!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Bejelentkezési hiba!" });
  }
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
  console.log("Elindult http://localhost:5173");
});
