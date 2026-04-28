import { reactive, computed } from "vue";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
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
  const hashedPassword = bcrypt.hashSync(Jelszo, 14);
  const letezo = await prisma.felhasznalok.findFirst({
    where: { Email: Email },
  });
  if (!Felhasznalonev || !Jelszo || !Jelszo2 || !Email)
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
          Felhasznalonev: Felhasznalonev,
          Jelszo: hashedPassword,
        },
      });

      res.status(201).send("Sikeres regisztráció");
    } catch (error) {
      console.error(error);
      res.status(500).send("Szerver hiba");
    }
  }
});

router.post("/login", async (req, res) => {
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
          id: user.ID,
          email: user.Email,
          name: user.Felhasznalonev,
          role: user.Jogosultsag,
        },
        "secret",
        {
          algorithm: "HS512",
          expiresIn: "1h", // A 15m nagyon rövid teteléshez
          issuer: "http://localhost:5173",
          subject: user.ID.toString(),
        }
      );

      Email;
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

const state = reactive({
  token: localStorage.getItem("token") || null,
  user: null,
});

const setAxiosHeader = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const useAuth = () => {
  const init = () => {
    if (state.token) {
      try {
        const decoded = jwtDecode(state.token);
        // Lejárat ellenőrzése
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          state.user = decoded;
          setAxiosHeader(state.token);
        }
      } catch (e) {
        logout();
      }
    }
  };

  const login = (token) => {
    state.token = token;
    state.user = jwtDecode(token);
    localStorage.setItem("token", token);
    setAxiosHeader(token);
  };

  const logout = () => {
    state.token = null;
    state.user = null;
    localStorage.removeItem("token");
    setAxiosHeader(null);
  };

  return {
    user: computed(() => state.user),
    isLoggedIn: computed(() => !!state.user),
    isAdmin: computed(() => state.user?.role === "ADMIN"),
    login,
    logout,
    init,
  };
};

export default router;
