const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/ContactController");

// Route POST pour envoyer un message via le formulaire de contact
router.post("/contact", ContactController.sendContactMessage);

module.exports = router;
