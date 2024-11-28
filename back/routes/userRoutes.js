const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile", UserController.getProfile);
router.put("/profile", UserController.updateProfile);
router.delete("/profile", UserController.deleteAccount);
router.get("/confirm-email", UserController.confirmEmail);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);

module.exports = router;
