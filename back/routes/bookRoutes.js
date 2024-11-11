// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const BookController = require("../controllers/BookController");
const LibraryController = require("../controllers/LibraryController");

router.get("/books", BookController.getAllBooks);
router.get("/books/:book_id", BookController.getBookById);
router.post("/books", BookController.addBook);
router.put("/books/:book_id", BookController.updateBook);
router.delete("/books/:book_id", BookController.deleteBook);

router.get("/library/:user_id", LibraryController.getLibrary);
router.post("/library", LibraryController.addToLibrary);
router.put("/library/:library_id", LibraryController.updateLibraryStatus);
router.delete("/library/:library_id", LibraryController.removeFromLibrary);

module.exports = router;
