const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
// Route protégée pour obtenir le profil de l'utilisateur connecté
router.get("/profile", UserController.getProfile);

module.exports = router;
