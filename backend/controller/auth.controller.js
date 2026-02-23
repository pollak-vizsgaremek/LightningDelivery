import { Router } from "express";
import { login, register } from "../services/auth.service.js";

const router = Router();

/**
 * @swagger
 * /auth:
 *  get:
 *    description: Get all users
 *    responses:
 *      200:
 *        description: Returns all users
 *      400:
 *        description: Cannot find any users
 */

router.get("/", (req, res) => {
  res.status(200).json({ message: "Ok!" });
});

/**
 * @swagger
 * /auth/login:
 *  post:
 *    description: Login endpoint
 *    tags:
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *        schema:
 *          type: object
 *          required:
 *            - username
 *            - password
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      200:
 *        description: Login successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                # Adjust these based on what your service actually returns
 *                message:
 *                  type: string
 *                  example: "Login successful!"
 *      400:
 *        description: Missing credentials
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Login failed!"
 *      401:
 *        description: Invalid credentials
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              example: "Invalid username or password!"
 */

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Hiányzó adatok!" });

  try {
    const data = await login(username, password);

    // 3. Fixed typo: changed 'date' to 'data'
    if (data === -1)
      return res.status(401).json("Hibás felhasználónév vagy jelszó!");

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Szerver hiba!", err: error });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password, firstName, lastName, passwordConfirm } =
    req.body;

  if (!username || !email || !password || !passwordConfirm)
    return res.status(400).json({ message: "Hiányzó adatok!" });

  try {
    const data = await register(
      username,
      email,
      firstName,
      lastName,
      password,
      passwordConfirm,
    );

    if (data === -1)
      return res.status(401).json({ message: "A jelszavak nem egyeznek meg!" });

    res.status(201).json({ message: "Sikeres regisztráció!", userId: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Szerver hiba!", err: error });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password, firstName, lastName, passwordConfirm } =
    req.body;

  if (!username || !email || !password || !passwordConfirm)
    return res.status(400).json({ message: "Hiányzó adatok!" });

  try {
    const data = await register(
      username,
      email,
      firstName,
      lastName,
      password,
      passwordConfirm,
    );

    if (data === -1)
      return res.status(401).json({ message: "A jelszavak nem egyeznek meg!" });

    res.status(201).json({ message: "Sikeres regisztráció!", userId: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Szerver hiba!", err: error });
  }
});

export default router;
