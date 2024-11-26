const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
require("dotenv").config();
require("./database");

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// CSRF token route
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Utilisation des routes
app.use("/api", userRoutes);
app.use("/api", bookRoutes);
app.use("/api", libraryRoutes);

// Vérification de connexion des routes
console.log("Routes /api/user et /api/book chargées avec succès.");
console.log("Route /api/library chargée avec succès.");
// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
