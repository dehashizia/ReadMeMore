const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("./database");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Route pour obtenir le token CSRF
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Route pour l'inscription
app.post("/api/register", async (req, res) => {
  console.log("Received request to /api/register", req.body);
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion dans la table "user" avec un rôle par défaut (user)
    const result = await pool.query(
      `INSERT INTO "user" (username, email, password, role_id) VALUES ($1, $2, $3, 1) RETURNING user_id, role_id`,
      [username, email, hashedPassword]
    );

    const userId = result.rows[0].user_id;
    const roleId = result.rows[0].role_id;

    // Générer un token JWT
    const token = jwt.sign({ userId, roleId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Répondre avec le message et le token
    res.status(201).json({ message: "User registered successfully", token });
    console.log("User registered successfully");
  } catch (error) {
    console.error("Error during registration", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Route pour la connexion
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user.rows[0].user_id, roleId: user.rows[0].role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "User logged in successfully", token });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
