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
module.exports = { sendConfirmationEmail, sendResetPasswordEmail };
