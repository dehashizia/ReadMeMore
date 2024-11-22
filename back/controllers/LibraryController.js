const jwt = require("jsonwebtoken");
const Library = require("../models/Library");
const Book = require("../models/Book");
const User = require("../models/User");

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

const addToLibrary = async (req, res) => {
  try {
    const user = verifyToken(req);
    const { book_id, status } = req.body; // Statut ajouté
    console.log("Statut reçu :", status); // Ajouter un log pour vérifier le statut
    const user_id = user.userId;

    if (!book_id || !status) {
      return res.status(400).json({ error: "ID du livre et statut requis." });
    }

    const existingEntry = await Library.findOne({
      where: { user_id, book_id },
    });

    if (existingEntry) {
      return res
        .status(400)
        .json({ message: "Ce livre est déjà dans votre bibliothèque." });
    }

    const newEntry = await Library.create({
      user_id,
      book_id,
      status, // Enregistrement du statut
    });

    res.status(201).json({
      message: "Livre ajouté à votre bibliothèque.",
      libraryEntry: newEntry,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre :", error);
    res.status(500).json({
      error:
        error.message || "Une erreur est survenue lors de l'ajout du livre.",
    });
  }
};

const getUserLibrary = async (req, res) => {
  try {
    const user = verifyToken(req);
    const user_id = user.userId;

    const library = await Library.findAll({
      where: { user_id },
      include: [
        {
          model: Book,
          attributes: [
            "book_id",
            "title",
            "authors",
            "thumbnail",
            "description",
            "published_date",
          ],
        },
      ],
    });

    // Ajout du statut du livre dans chaque entrée de la bibliothèque
    const booksWithStatus = library.map((entry) => ({
      ...entry.Book.dataValues,
      status: entry.status,
    }));

    res.status(200).json({ books: booksWithStatus });
  } catch (error) {
    console.error("Erreur lors de la récupération de la bibliothèque :", error);
    res.status(500).json({
      error: error.message || "Impossible de récupérer votre bibliothèque.",
    });
  }
};

const removeFromLibrary = async (req, res) => {
  try {
    const user = verifyToken(req);
    const { book_id } = req.body;
    const user_id = user.userId;

    if (!book_id) {
      return res.status(400).json({ error: "ID du livre requis." });
    }

    const entry = await Library.findOne({
      where: { user_id, book_id },
    });

    if (!entry) {
      return res
        .status(404)
        .json({ error: "Livre non trouvé dans votre bibliothèque." });
    }

    await entry.destroy();

    res.status(200).json({ message: "Livre retiré de votre bibliothèque." });
  } catch (error) {
    console.error("Erreur lors de la suppression du livre :", error);
    res.status(500).json({
      error:
        error.message ||
        "Impossible de retirer le livre de votre bibliothèque.",
    });
  }
};
const updateBookStatus = async (req, res) => {
  try {
    const user = verifyToken(req);
    const { book_id, status } = req.body;
    const user_id = user.userId;

    if (!book_id || !status) {
      return res.status(400).json({ error: "ID du livre et statut requis." });
    }

    const entry = await Library.findOne({ where: { user_id, book_id } });

    if (!entry) {
      return res
        .status(404)
        .json({ error: "Livre non trouvé dans votre bibliothèque." });
    }

    entry.status = status;
    await entry.save();

    res.status(200).json({ message: "Statut mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    res.status(500).json({
      error: error.message || "Impossible de mettre à jour le statut.",
    });
  }
};

module.exports = {
  addToLibrary,
  getUserLibrary,
  removeFromLibrary,
  updateBookStatus,
};
