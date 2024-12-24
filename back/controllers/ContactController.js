const { sendEmail } = require("../mailer");
const jwt = require("jsonwebtoken");

const verifyToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1]; // Récupérer le token dans l'en-tête Authorization
  if (!token) {
    throw new Error("Authentification requise.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token avec la clé secrète
    return decoded;
  } catch (error) {
    throw new Error("Token invalide.");
  }
};

const sendContactMessage = async (req, res) => {
  try {
    // Vérification du token avant de procéder
    const user = verifyToken(req); // Assure-toi que l'utilisateur est authentifié

    const { name, email, message } = req.body;

    // Validation des champs
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    // Envoi de l'email avec Nodemailer
    await sendEmail(
      process.env.EMAIL_USER, // Email destinataire
      `Nouveau message de ${name} (Formulaire de contact)`, // Sujet
      `Nom: ${name}\nEmail: ${email}\nMessage:\n${message}`, // Texte brut
      `<p><strong>Nom:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Message:</strong></p>
       <p>${message}</p>` // HTML
    );

    // Réponse si tout va bien
    res
      .status(200)
      .json({ message: "Votre message a été envoyé avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message de contact :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message." });
  }
};

module.exports = { sendContactMessage };
