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
  }),
);

// login és register


app.use("/api/v1/users", authMiddleware, userController);
app.use(
  cors({
    origin: "http://localhost:3300",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// register

function register() {

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
    const letezo = await prisma.felhasznalok.findUnique({ where: { email } });
    if (letezo)
      return res.status(400).json({ message: "Az email már foglalt!" });

    const hashedPwd = await bcrypt.hash(password, 12);

    await prisma.felhasznalok.create({
      data: {
        Felhasznalonev,
        Email,
        TeljesNev,        
        password: hashedPwd,
      },
    });

    res.status(201).json({ message: "Sikeres regisztráció!" });
  } catch (error) {
    // ha szerver hiba történik, akkor irtam ide egy catch-et

    res.status(500).json({ message: "Szerver hiba történt!" });
  }
});
}



// login

function login() {

app.post("/api/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email és jelszó megadása kötelező!" });

    const user = await prisma.felhasznalok.findUnique({ where: { email } });

    // BIZTONSÁGOS ELLENŐRZÉS: Ha nincs user, ne dobjon hibát a bcrypt
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jsonwebtoken.sign(
        {
          email: user.Email,
          name: user.Felhasznalonev,
        },
        "secret",
        {
          algorithm: "HS512",
          expiresIn: "1h", // A 15m nagyon rövid teteléshez
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
  }
});

////////////////////////
}


// rendelések

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
  } catch (error) {
    console.error(error);
    res.status(500).send("Szerver hiba");
  }
});

app.post("/api/bejelentkezes", async (req, res) => {
  const data = req.body;
  const plainPassword = data.Jelszo;
  const hashedPassword = await prisma.felhasznalok.findUnique({
    where: {
      Felhasznalonev: data.Felhasznalonev,
    },
  });
  bcrypt.compare(plainPassword, hashedPassword).then(function (result) {
    if (result) {
      res.status(200).send("Sikeres bejelentkezés");
    } else {
      res.status(400).send("Helytelen adatok");
    }
  });
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
