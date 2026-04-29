import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";
const prisma = new PrismaClient();
import sendRecoveryEmail from "../server/nodemailer.js";

const router = Router();

//Register

router.post("/register", async (req, res) => {
  const { Felhasznalonev, Jelszo, Jelszo2, Email } = req.body;

  const normalizedName = String(Felhasznalonev ?? "").trim();
  const normalizedEmail = String(Email ?? "")
    .trim()
    .toLowerCase();

  if (!normalizedName || !Jelszo || !Jelszo2 || !normalizedEmail) {
    return res.status(400).json({ message: "Minden mező kitöltése kötelező!" });
  }

  if (Jelszo !== Jelszo2) {
    return res.status(400).json({ message: "A jelszavak nem egyeznek!" });
  }

  try {
    const existingUser = await prisma.felhasznalok.findFirst({
      where: {
        OR: [{ Email: normalizedEmail }, { Felhasznalonev: normalizedName }],
      },
    });

    if (existingUser) {
      if (existingUser.Email === normalizedEmail) {
        return res.status(400).json({ message: "Az email már foglalt!" });
      }

      return res.status(400).json({ message: "A felhasználónév már foglalt!" });
    }

    const hashedPassword = await bcrypt.hash(Jelszo, 14);

    await prisma.felhasznalok.create({
      data: {
        Email: normalizedEmail,
        Felhasznalonev: normalizedName,
        Jelszo: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Sikeres regisztráció" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Szerver hiba" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { Email, Jelszo } = req.body;
    const normalizedEmail = String(Email ?? "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail || !Jelszo)
      return res
        .status(400)
        .json({ message: "Email és jelszó megadása kötelező!" });

    const user = await prisma.felhasznalok.findUnique({
      where: { Email: normalizedEmail },
    });

    // BIZTONSÁGOS ELLENŐRZÉS: Ha nincs user, ne dobjon hibát a bcrypt
    if (user && (await bcrypt.compare(Jelszo, user.Jelszo))) {
      const accessToken = jsonwebtoken.sign(
        {
          id: user.ID,
          email: user.Email,
          name: user.Felhasznalonev,
          role: user.Jogosultsag,
        },
        "secret",
        {
          algorithm: "HS512",
          expiresIn: "1h", // A 15m nagyon rövid teszteléshez
          issuer: "http://localhost:5173",
          subject: user.ID.toString(),
        },
      );

      return res.status(200).json({
        accessToken,
        userId: user.ID,
        userName: user.Felhasznalonev,
        role: user.Jogosultsag,
      });
    } else {
      return res.status(401).json({ message: "Hibás email vagy jelszó!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Bejelentkezési hiba!" });
    console.log(error);
  }
});

router.post("/forgot-password", async (req, res) => {
  const { Email } = req.body;
  const { id } = req.params;

  if (!Email) {
    return res.status(400).send("Email cím megadása kötelező.");
  }

  const user = await prisma.felhasznalok.findUnique({
    where: { Email: Email },
  });

  if (!user) return res.status(404).send("Nincs ilyen felhasználó.");

  const secret = process.env.JWT_SECRET + user.Jelszo;
  const token = jsonwebtoken.sign({ id: user.ID, email: user.Email }, secret, {
    expiresIn: "15m",
  });
  await prisma.felhasznalok.update({
    where: { Email: Email },
    data: { PasswordResetToken: token },
  });

  const link = `http://localhost:3000/reset-password/${user.ID}/${token}`;

  console.log("Link:", link);
  res.send("A visszaállító linket elküldtük!");
  sendRecoveryEmail(Email, link);
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { Jelszo } = req.body;

  try {
    const user = await prisma.felhasznalok.findUnique({
      where: { ID: Number(id) },
    });

    if (!user) return res.status(404).send("Felhasználó nem található.");

    const secret = process.env.JWT_SECRET + user.Jelszo;
    jsonwebtoken.verify(token, secret);

    const hashedPassword = await bcrypt.hash(Jelszo, 14);

    await prisma.felhasznalok.update({
      where: { ID: Number(id) },
      data: { Jelszo: hashedPassword },
    });

    res.send("A jelszó sikeresen megváltoztatva!");
  } catch (error) {
    res.status(400).send("Érvénytelen vagy lejárt link.");
  }
});

export default router;
