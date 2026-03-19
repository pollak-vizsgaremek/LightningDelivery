import e from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";
import userController from "./controller/user.controller.js";
import authMiddleware from "./middleware/auth.middleware.js";

const app = e();
const prisma = new PrismaClient();

app.use(e.json());
app.use(cors());
app.use(e.json());

// login és register

app.use("/api/v1/users", authMiddleware, userController);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);



////////////////////////

// rendelések

app.get("/api/rendeles", async (_, res) => {
  const data = await prisma.rendeles.findMany();
  res.status(200).json(data);
});

app.get("/api/users", async (_, res) => {
  const data = await prisma.felhasznalok.findMany();
  res.status(200).json(data);
});

// login

app.post("/api/v1/login", async (req, res) => {
  try {
    const { Email, Jelszo } = req.body;

    if (!Email || !Jelszo)
      return res
        .status(400)
        .json({ message: "Email és jelszó megadása kötelező!" });

    const user = await prisma.felhasznalok.findUnique({
      where: { Email: Email },
    });

    // BIZTONSÁGOS ELLENŐRZÉS: Ha nincs user, ne dobjon hibát a bcrypt
    if (user && (await bcrypt.compare(Jelszo, user.Jelszo))) {
      const accessToken = jsonwebtoken.sign(
        {
          email: user.Email,
          jelszo: user.Jelszo,
        },
        "secret",
        {
          algorithm: "HS512",
          expiresIn: "1h",
          issuer: "http://localhost:5173",
          subject: user.ID.toString(),
        },
      );

      return res.status(200).json({
        accessToken,
        userId: user.ID,
        userName: user.TeljesNev,
      });
    } else {
      return res.status(401).json({ message: "Hibás email vagy jelszó!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Bejelentkezési hiba!" });
    console.log(error);
  }
});


//register

app.post("/api/v1/register", async (req, res) => {
  const { Jelszo, Jelszo2, Email, TeljesNev } = req.body;
  const hashedPassword = bcrypt.hashSync(Jelszo, 14);
  const letezo = await prisma.felhasznalok.findFirst({
    where: { Email: Email },
  });
  if (!Jelszo || !Jelszo2 || !Email || !TeljesNev)
    return res.status(400).json({ message: "Minden mező kitöltése kötelező!" });
  if (Jelszo !== Jelszo2) {
    return res.status(400).json({ message: "A jelszavak nem egyeznek!" });
  }
  if (letezo) res.status(400).json({ message: "Az email már foglalt!" });

  if (!letezo) {
    try {
      await prisma.felhasznalok.create({
        data: {
          Email: Email,
          Jelszo: hashedPassword,
          TeljesNev: TeljesNev,
        },
      });

      res.status(201).send("Sikeres regisztráció");
    } catch (error) {
      console.error(error);
      res.status(500).send("Szerver hiba");
    }
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
    console.error(error);
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
