const jwt = require("jsonwebtoken");
const Comment = require("../models/Comment");
const Book = require("../models/Book");
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

// Ajouter un commentaire
const addComment = async (req, res) => {
  try {
    const user = verifyToken(req);
    const { bookId } = req.params;
    const { text, rating } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ error: "Le texte du commentaire est requis." });
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: "Livre non trouvé." });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ error: "La note doit être comprise entre 1 et 5." });
    }

    const newComment = await Comment.create({
      user_id: user.userId,
      book_id: bookId,
      text,
      rating,
      date: new Date(),
    });

    const commentWithUser = await newComment.reload({
      include: [
        { model: User, as: "user", attributes: ["username"] },
        { model: Book, as: "book", attributes: ["title"] },
      ],
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'ajout du commentaire." });
  }
};

// Récupérer les commentaires d'un livre
const getCommentsByBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { book_id: bookId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
        {
          model: Book,
          as: "book",
          attributes: ["title"],
        },
      ],
    });

    res.json(comments);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};
// Supprimer un commentaire
const deleteComment = async (req, res) => {
  try {
    const user = verifyToken(req);
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Commentaire non trouvé." });
    }

    if (comment.user_id !== user.userId) {
      return res
        .status(403)
        .json({ error: "Non autorisé à supprimer ce commentaire." });
    }

    await comment.destroy();
    res.status(200).json({ message: "Commentaire supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire :", error);
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        { model: User, as: "user", attributes: ["username"] },
        { model: Book, as: "book", attributes: ["title", "thumbnail"] },
      ],
      order: [["date", "DESC"]], // Trier par date décroissante
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

module.exports = {
  addComment,
  getCommentsByBook,
  deleteComment,
  getAllComments,
};
