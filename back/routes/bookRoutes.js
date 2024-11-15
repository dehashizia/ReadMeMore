// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const BookController = require("../controllers/BookController");
const LibraryController = require("../controllers/LibraryController");
router.get("/library/:user_id", LibraryController.getLibrary);
router.post("/library", LibraryController.addToLibrary);
router.put("/library/:library_id", LibraryController.updateLibraryStatus);
router.delete("/library/:library_id", LibraryController.removeFromLibrary);
router.get("/search-books", BookController.searchBooks);

module.exports = router;
