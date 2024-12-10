// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const BookController = require("../controllers/BookController");

router.get("/search-books", BookController.searchBooks);
router.get("/books/:bookId", BookController.getBookDetails);
router.get("/books/isbn/:isbn", BookController.scanBookByIsbn); // Route pour le scan ISBN
router.patch("/:bookId/make-available", BookController.markBookAsAvailable);
router.get("/books/available", BookController.getAvailableBooks);
router.post("/loans/request", BookController.requestLoan);
router.get("/loans/requests", BookController.getLoanRequests);

// Si tu veux aussi ajouter la route pour accepter ou refuser une demande de prêt
router.put(
  "/loans/requests/:requestId",
  BookController.updateLoanRequestStatus
);

module.exports = router;
