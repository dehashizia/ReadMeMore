const Message = require("../models/Message");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Fonction de vérification du token
const verifyToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new Error("Authentification requise.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Token invalide.");
  }
};

const sendMessage = async (req, res) => {
  const { requestId, content } = req.body;
  const { senderId, recipientId } = req.params; // Récupérer les ids des utilisateurs

  try {
    // Vérification de l'authentification (senderId doit être l'id de l'utilisateur connecté)
    const decoded = verifyToken(req);
    if (decoded.user_id !== Number.parseInt(senderId)) {
      return res.status(403).json({
        error: "Vous ne pouvez envoyer un message que depuis votre compte.",
      });
    }

    const sender = await User.findByPk(Number.parseInt(senderId)); // Utiliser Number.parseInt
    const recipient = await User.findByPk(Number.parseInt(recipientId));

    if (!sender || !recipient) {
      return res
        .status(404)
        .json({ error: "Expéditeur ou destinataire non trouvé." });
    }

    // Créer le message
    const newMessage = await Message.create({
      loan_request_id: requestId,
      sender_id: senderId,
      recipient_id: recipientId,
      content,
    });

    // Récupérer les données du message avec les utilisateurs expéditeur et destinataire
    const messageWithUsers = await Message.findOne({
      where: { message_id: newMessage.message_id },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["username", "profile_photo"],
        },
        {
          model: User,
          as: "recipient",
          attributes: ["username", "profile_photo"],
        },
      ],
    });

    // Retourner le message créé avec les informations de l'expéditeur et du destinataire
    res.status(201).json(messageWithUsers);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    res.status(500).json({ error: "Une erreur est survenue." });
  }
};

const getMessages = async (req, res) => {
  const { requestId, recipientUsername } = req.params;
  try {
    const recipient = await User.findOne({
      where: { username: recipientUsername },
    });

    if (!recipient) {
      return res
        .status(404)
        .json({ error: "Utilisateur destinataire non trouvé" });
    }

    const messages = await Message.findAll({
      where: {
        loan_request_id: requestId,
        recipient_id: recipient.user_id,
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["username", "profile_photo"],
        },
        {
          model: User,
          as: "recipient",
          attributes: ["username", "profile_photo"],
        },
      ],
      order: [["timestamp", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error); // Plus de détails sur l'erreur ici
    res
      .status(500)
      .json({ error: error.message || "Une erreur est survenue." });
  }
};

module.exports = { sendMessage, getMessages };
