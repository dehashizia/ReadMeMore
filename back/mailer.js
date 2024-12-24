const nodemailer = require("nodemailer");

// Transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction d'envoi de l'email de confirmation
const sendConfirmationEmail = (email, token) => {
  const confirmationUrl = `${process.env.BASE_URL}/confirm-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmez votre adresse email",
    text: `Bienvenue ! Cliquez sur ce lien pour confirmer votre adresse email : ${confirmationUrl}`,
    html: `<p>Bienvenue !</p><p>Cliquez sur ce lien pour confirmer votre adresse email : <a href="${confirmationUrl}">${confirmationUrl}</a></p>`,
  };

  return transporter.sendMail(mailOptions);
};

// Fonction d'envoi de l'email de réinitialisation de mot de passe
const sendResetPasswordEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
    html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><a href="${resetLink}">${resetLink}</a>`,
  };

  return transporter.sendMail(mailOptions);
};
// Fonction pour envoyer une notification de demande de prêt
const sendLoanRequestEmail = (email, username, bookTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // Adresse e-mail du propriétaire du livre
    subject: "Nouvelle demande de prêt de livre",
    text: `Bonjour ${username},\n\nUne nouvelle demande de prêt a été effectuée pour le livre "${bookTitle}".\n\nConnectez-vous pour accepter ou refuser cette demande.`,
    html: `<p>Bonjour ${username},</p>
           <p>Une nouvelle demande de prêt a été effectuée pour le livre "<strong>${bookTitle}</strong>".</p>
           <p><a href="${process.env.BASE_URL}/loan-requests">Connectez-vous</a> pour accepter ou refuser cette demande.</p>`,
  };

  return transporter.sendMail(mailOptions);
};
// Fonction pour envoyer un e-mail de notification pour les demandes de prêt
const sendLoanRequestNotification = async (email, bookTitle, status) => {
  try {
    const subject =
      status === "accepted"
        ? "Votre demande de prêt a été acceptée"
        : "Votre demande de prêt a été refusée";

    const message =
      status === "accepted"
        ? `Félicitations ! Votre demande pour le livre "${bookTitle}" a été acceptée.`
        : `Désolé, votre demande pour le livre "${bookTitle}" a été refusée.`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text: message,
    });

    console.log(
      `E-mail envoyé avec succès à ${email} pour le statut ${status}`
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
  }
};
// Fonction générique pour envoyer des emails
const sendEmail = async (to, subject, text, html = "") => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Email expéditeur
    to, // Destinataire
    subject, // Sujet de l'email
    text, // Contenu texte
    html, // Contenu HTML (optionnel)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email envoyé avec succès à ${to}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw error; // Relancer l'erreur pour gestion dans le contrôleur
  }
};

module.exports = {
  sendConfirmationEmail,
  sendResetPasswordEmail,
  sendLoanRequestEmail,
  sendLoanRequestNotification,
  sendEmail,
};
