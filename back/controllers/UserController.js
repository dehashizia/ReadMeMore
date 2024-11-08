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
    res
      .status(500)
      .json({
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
