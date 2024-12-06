const axios = require("axios");
const { Op } = require("sequelize");
const Book = require("../models/Book");
const Category = require("../models/Category");
const User = require("../models/User");

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

const searchBooks = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ error: "Veuillez fournir un terme de recherche." });
  }

  try {
    const existingBooks = await Book.findAll({
      where: { title: { [Op.iLike]: `%${query}%` } },
      include: {
        model: Category,
        as: "category",
        attributes: ["category_name"],
      },
    });

    if (existingBooks.length > 0) {
      return res.json(
        existingBooks.map((book) => ({
          ...book.toJSON(),
          source: "database",
          category_name: book.Category
            ? book.Category.category_name
            : "Non classé",
        }))
      );
    }

    const googleBooksResponse = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: query,
          key: GOOGLE_BOOKS_API_KEY,
          maxResults: 10,
        },
      }
    );
    const booksData = googleBooksResponse.data.items;

    const books = [];
    for (const bookData of booksData) {
      const volumeInfo = bookData.volumeInfo;
      const categoryName = volumeInfo.categories?.[0] || "Non catégorisé";

      let category = await Category.findOne({
        where: { category_name: categoryName },
      });
      if (!category) {
        category = await Category.create({ category_name: categoryName });
      }

      const isbn = volumeInfo.industryIdentifiers?.[0]?.identifier;
      if (!isbn) {
        books.push({
          title: volumeInfo.title,
          authors: volumeInfo.authors || ["Auteur inconnu"],
          category_name: categoryName,
          source: "unknown",
        });
        continue;
      }

      const existingBook = await Book.findOne({
        where: { isbn },
        include: { model: Category, as: "category" },
      });
      if (!existingBook) {
        const newBook = await Book.create({
          title: volumeInfo.title,
          authors: volumeInfo.authors || ["Auteur inconnu"],
          category_id: category.category_id,
          published_date: volumeInfo.publishedDate,
          description: volumeInfo.description,
          isbn: isbn,
          page_count: volumeInfo.pageCount,
          thumbnail: volumeInfo.imageLinks?.thumbnail,
          language: volumeInfo.language,
        });

        books.push({
          ...newBook.toJSON(),
          source: "google_books",
          category_name: categoryName,
        });
      } else {
        books.push({
          ...existingBook.toJSON(),
          source: "database",
          category_name: existingBook.Category
            ? existingBook.Category.category_name
            : "Non classé",
        });
      }
    }

    res.json(books);
  } catch (error) {
    console.error("Erreur lors de la recherche de livres :", error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de la recherche de livres.",
    });
  }
};
const getBookDetails = async (req, res) => {
  const { bookId } = req.params;

  // Vérifier si bookId est une valeur valide
  if (bookId === "available") {
    // Si "available" est passé, chercher les livres disponibles
    try {
      const availableBooks = await Book.findAll({
        where: { is_available_for_loan: true }, // Assume que le champ est un booléen
        include: {
          model: Category,
          as: "category",
          attributes: ["category_name"],
        },
      });

      if (availableBooks.length === 0) {
        return res
          .status(404)
          .json({ error: "Aucun livre disponible trouvé." });
      }

      // Retourner les livres disponibles
      res.json(
        availableBooks.map((book) => ({
          ...book.toJSON(),
          category_name: book.category
            ? book.category.category_name
            : "Non catégorisé",
        }))
      );
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des livres disponibles :",
        error
      );
      res.status(500).json({
        error:
          "Une erreur s'est produite lors de la récupération des livres disponibles.",
      });
    }
  } else {
    // Si c'est un bookId normal, rechercher par book_id
    try {
      const book = await Book.findOne({
        where: { book_id: bookId }, // Ici, bookId doit être un entier
        include: {
          model: Category,
          as: "category",
          attributes: ["category_name"],
        },
      });

      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé." });
      }

      res.json({
        ...book.toJSON(),
        category_name: book.category
          ? book.category.category_name
          : "Non catégorisé",
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du livre :",
        error
      );
      res.status(500).json({
        error:
          "Une erreur s'est produite lors de la récupération des détails du livre.",
      });
    }
  }
};
// Nouvelle méthode pour le scan par ISBN
const scanBookByIsbn = async (req, res) => {
  const { isbn } = req.params;

  try {
    // Recherche dans la base de données
    const existingBook = await Book.findOne({
      where: { isbn },
      include: {
        model: Category,
        as: "category",
        attributes: ["category_name"],
      },
    });

    if (existingBook) {
      return res.json({
        ...existingBook.toJSON(),
        category_name: existingBook.category
          ? existingBook.category.category_name
          : "Non classé",
        source: "database",
      });
    }

    // Si non trouvé, recherche via l'API Google Books
    const googleBooksResponse = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_BOOKS_API_KEY}`
    );

    const volumeInfo = googleBooksResponse.data.items?.[0]?.volumeInfo;
    if (!volumeInfo) {
      return res.status(404).json({ error: "Livre non trouvé." });
    }

    const categoryName = volumeInfo.categories?.[0] || "Non classé";
    let category = await Category.findOne({
      where: { category_name: categoryName },
    });

    if (!category) {
      category = await Category.create({ category_name: categoryName });
    }

    const newBook = await Book.create({
      title: volumeInfo.title,
      authors: volumeInfo.authors || ["Auteur inconnu"],
      category_id: category.category_id,
      published_date: volumeInfo.publishedDate,
      description: volumeInfo.description,
      isbn,
      page_count: volumeInfo.pageCount,
      thumbnail: volumeInfo.imageLinks?.thumbnail,
      language: volumeInfo.language,
    });

    res.json({
      ...newBook.toJSON(),
      category_name: categoryName,
      source: "google_books",
    });
  } catch (error) {
    console.error("Erreur lors de la recherche par ISBN :", error);
    res.status(500).json({ error: "Une erreur est survenue." });
  }
};
const markBookAsAvailable = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ error: "Livre non trouvé" });

    book.is_available_for_loan = true;
    await book.save();

    res.json({ message: "Livre marqué comme disponible pour prêt." });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ error: "Une erreur est survenue." });
  }
};
const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { is_available_for_loan: true }, // Vérifie la colonne correspondante
      attributes: ["book_id", "title", "authors"],
    });
    res.json(books);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des livres disponibles :",
      error
    );
    res.status(500).json({ error: "Une erreur est survenue." });
  }
};
module.exports = {
  searchBooks,
  getBookDetails,
  scanBookByIsbn,
  markBookAsAvailable,
  getAvailableBooks,
};
