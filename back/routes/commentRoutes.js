const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");

// Ajouter un commentaire à un livre
router.post("/books/:bookId/comments", CommentController.addComment);

// Récupérer les commentaires d'un livre
router.get("/books/:bookId/comments", CommentController.getCommentsByBook);
// Supprimer un commentaire
router.delete("/comments/:commentId", CommentController.deleteComment);

// Modifier un commentaire
router.put("/comments/:commentId", CommentController.updateComment);

module.exports = router;
