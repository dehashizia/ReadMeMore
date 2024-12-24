const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/MessageController");

// Route pour envoyer un message
router.post("/messages/:requestId/:recipientId", MessageController.sendMessage);

// Route pour obtenir les messages d'une demande de prêt
router.get(
  "/messages/:requestId/:recipientUsername",
  MessageController.getMessages
);
module.exports = router;
