const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const multer = require("multer");
const path = require("node:path");
require("dotenv").config();
require("./database");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes");
const contactRoutes = require("./routes/contactRoutes");
const app = express();
const port = process.env.PORT || 4000;

app.use("/uploads", express.static("uploads"));

// Configuration du stockage des fichiers avec Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads", "profiles"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// Initialisation de Multer
const upload = multer({ storage: storage });

// Route pour l'upload de la photo de profil
app.post(
  "/api/upload-profile-photo",
  upload.single("profilePhoto"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Aucune image sélectionnée" });
    }

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Token manquant" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const user = await User.findOne({ where: { user_id: userId } });
      if (!user)
        return res.status(404).json({ error: "Utilisateur non trouvé" });

      // Mise à jour de la photo de profil dans la base de données
      const updatedUser = await User.update(
        { profile_photo: req.file.filename },
        { where: { user_id: userId } }
      );

      if (updatedUser[0] === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      res.json({
        message: "Photo de profil mise à jour avec succès",
        profile_photo: req.file.filename,
      });
    } catch (error) {
      console.error("Erreur lors de l'upload de la photo de profil", error);
      res.status(500).json({ error: "Erreur serveur lors de l'upload" });
    }
  }
);

// Middleware - Ordre important
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
  })
);

// Configuration de helmet avec les paramètres CSRF
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// CSRF configuration
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

// Route CSRF avant la protection
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Appliquer CSRF protection après la route du token
app.use("/api", csrfProtection);

// Utilisation des routes
app.use("/api", userRoutes);
app.use("/api", bookRoutes);
app.use("/api", libraryRoutes);
app.use("/api", commentRoutes);
app.use("/api", messageRoutes);
app.use("/api", contactRoutes);

// Vérification de connexion des routes
console.log("Routes /api/user et /api/book chargées avec succès.");
console.log("Route /api/library chargée avec succès.");

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      error: "Invalid CSRF token",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
  res.status(500).json({
    error: "Something went wrong!",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Démarrage du serveur avec gestion d'erreur
const server = app
  .listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
