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
    const { book_id } = req.body;
    const user_id = user.userId;

    if (!book_id) {
      return res.status(400).json({ error: "ID du livre requis." });
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
      status: "liked",
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

    const books = library.map((entry) => entry.Book);

    res.status(200).json({ books });
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

module.exports = {
  addToLibrary,
  getUserLibrary,
  removeFromLibrary,
};
