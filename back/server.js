const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
require("./database");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const app = express();
const port = process.env.PORT || 3000;
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use(express.urlencoded({ extended: true }));

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

const upload = multer({ storage: storage });

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

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api", userRoutes);
app.use("/api", bookRoutes);
app.use("/api", libraryRoutes);

console.log("Routes /api/user et /api/book chargées avec succès.");
console.log("Route /api/library chargée avec succès.");

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
