// controllers/BookController.js
const Book = require("../models/Book");
const { Op } = require("sequelize");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).json({ error: "Unable to fetch books" });
  }
};

exports.getBookById = async (req, res) => {
  const { book_id } = req.params;
  try {
    const book = await Book.findByPk(book_id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.error("Error fetching book", error);
    res.status(500).json({ error: "Unable to fetch book" });
  }
};

exports.addBook = async (req, res) => {
  const {
    title,
    authors,
    category_id,
    published_date,
    description,
    isbn,
    page_count,
    thumbnail,
    language,
    barcode,
  } = req.body;

  try {
    const newBook = await Book.create({
      title,
      authors,
      category_id,
      published_date,
      description,
      isbn,
      page_count,
      thumbnail,
      language,
      barcode,
    });
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error adding book", error);
    res.status(500).json({ error: "Unable to add book" });
  }
};

exports.updateBook = async (req, res) => {
  const { book_id } = req.params;
  const {
    title,
    authors,
    category_id,
    published_date,
    description,
    isbn,
    page_count,
    thumbnail,
    language,
    barcode,
  } = req.body;

  try {
    const book = await Book.findByPk(book_id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    await book.update({
      title,
      authors,
      category_id,
      published_date,
      description,
      isbn,
      page_count,
      thumbnail,
      language,
      barcode,
    });
    res.json(book);
  } catch (error) {
    console.error("Error updating book", error);
    res.status(500).json({ error: "Unable to update book" });
  }
};

exports.deleteBook = async (req, res) => {
  const { book_id } = req.params;

  try {
    const book = await Book.findByPk(book_id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    await book.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting book", error);
    res.status(500).json({ error: "Unable to delete book" });
  }
};
