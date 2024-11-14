const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// Schéma de validation pour l'enregistrement
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .message(
      "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial."
    )
    .required(),
});

// Schéma de validation pour la connexion
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

exports.register = async (req, res) => {
  // Conversion de l'email en minuscules pour assurer l'unicité
  const { username, email, password } = req.body;
  const lowercaseEmail = email.toLowerCase();

  // Validation des données
  const { error } = registerSchema.validate({
    username,
    email: lowercaseEmail,
    password,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Vérification de l'unicité de l'email
    const existingUser = await User.findOne({
      where: { email: lowercaseEmail },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "L'adresse e-mail est déjà utilisée." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email: lowercaseEmail,
      password: hashedPassword,
    });

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user.user_id, roleId: user.role_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("User registered:", {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    });
    res
      .status(201)
      .json({ message: "Utilisateur enregistré avec succès", token });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement", error);
    res.status(500).json({
      error: "Échec de l'enregistrement en raison d'une erreur serveur",
    });
  }
};

exports.login = async (req, res) => {
  // Conversion de l'email en minuscules pour la comparaison
  const { email, password } = req.body;
  const lowercaseEmail = email.toLowerCase();

  // Validation des données
  const { error } = loginSchema.validate({ email: lowercaseEmail, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await User.findOne({ where: { email: lowercaseEmail } });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Email ou mot de passe incorrect." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ error: "Email ou mot de passe incorrect." });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user.user_id, roleId: user.role_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("User logged in:", {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    });
    res.json({ message: "Utilisateur connecté avec succès", token });
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
    res
      .status(500)
      .json({ error: "Échec de la connexion en raison d'une erreur serveur" });
  }
};
exports.getProfile = async (req, res) => {
  // Vérifie si le token est passé dans l'en-tête Authorization
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    // Vérifie le token et décode-le
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    console.log("User ID from token:", userId);

    // Récupère les informations de l'utilisateur dans la base de données
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.json({
      username: user.username,
      email: user.email,
      roleId: user.role_id,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token invalide" });
    }
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération du profil." });
  }
};
exports.updateProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { username, email, newPassword } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.update(updateData, {
      where: { user_id: userId },
    });

    if (updatedUser[0] === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    console.log("Profile updated successfully for user ID:", decoded.userId);

    // Indiquer au frontend que l'utilisateur doit se reconnecter si le mot de passe est mis à jour
    res.json({
      message: "Profil mis à jour avec succès",
      passwordChanged: !!newPassword,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token invalide" });
    }
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la mise à jour du profil." });
  }
};
exports.deleteAccount = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const deletedUser = await User.destroy({ where: { user_id: userId } });

    if (!deletedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte", error);
    res.status(500).json({ error: "Erreur serveur lors de la suppression" });
  }
};
