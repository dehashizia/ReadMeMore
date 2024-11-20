// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const BookController = require("../controllers/BookController");

router.get("/search-books", BookController.searchBooks);

module.exports = router;
