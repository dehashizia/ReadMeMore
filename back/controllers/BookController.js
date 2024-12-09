const axios = require("axios");
const { Op } = require("sequelize");
const Book = require("../models/Book");
const Category = require("../models/Category");
const User = require("../models/User");
const LoanRequest = require("../models/LoanRequest");

const jwt = require("jsonwebtoken");

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const verifyToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new Error("Authentification requise.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé :", decoded);
    return decoded;
  } catch (error) {
    throw new Error("Token invalide.");
  }
};

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

  if (bookId === "available") {
    try {
      const availableBooks = await Book.findAll({
        where: { is_available_for_loan: true },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["category_name"],
          },
          {
            model: User,
            as: "user",
            attributes: ["username"],
          },
        ],
      });

      if (availableBooks.length === 0) {
        return res
          .status(404)
          .json({ error: "Aucun livre disponible trouvé." });
      }

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
    try {
      const book = await Book.findOne({
        where: { book_id: bookId },
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

const markBookAsAvailable = async (req, res) => {
  const { bookId } = req.params;

  try {
    const user = verifyToken(req);
    const userId = user.userId;

    if (!userId) {
      return res.status(400).json({ error: "Utilisateur non connecté" });
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }

    book.is_available_for_loan = true;
    book.user_id = userId;
    await book.save();

    const userWhoAddedBook = await User.findOne({
      where: { user_id: book.user_id },
    });

    res.json({
      message: "Livre marqué comme disponible pour prêt.",
      userWhoAddedBook: userWhoAddedBook
        ? userWhoAddedBook.username
        : "Inconnu",
    });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ error: "Une erreur est survenue." });
  }
};

const scanBookByIsbn = async (req, res) => {
  const { isbn } = req.params;

  try {
    const user = verifyToken(req);

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

const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { is_available_for_loan: true },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
      attributes: ["book_id", "title", "authors"],
    });

    const booksWithUser = books.map((book) => ({
      ...book.toJSON(),
      user: book.user ? book.user.username : "Utilisateur inconnu",
    }));

    res.json(booksWithUser);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des livres disponibles :",
      error
    );
    res.status(500).json({ error: "Une erreur est survenue." });
  }
};
const requestLoan = async (req, res) => {
  const { bookId } = req.body;
  const user = verifyToken(req);

  if (!bookId) {
    return res.status(400).json({ error: "ID du livre requis" });
  }

  try {
    const book = await Book.findOne({
      where: { book_id: bookId, is_available_for_loan: true },
    });

    if (!book) {
      return res
        .status(404)
        .json({ error: "Livre non disponible pour le prêt" });
    }

    const loanRequest = await LoanRequest.create({
      book_id: bookId,
      user_id: user.userId,
      status: "En attente",
    });

    res.status(201).json({ message: "Demande de prêt envoyée", loanRequest });
  } catch (error) {
    console.error("Erreur lors de la demande de prêt :", error);
    res.status(500).json({ error: "Erreur lors de la demande de prêt" });
  }
};
const getLoanRequests = async (req, res) => {
  try {
    const user = verifyToken(req);
    const userId = user.userId;

    if (!userId) {
      return res.status(400).json({ error: "Utilisateur non connecté." });
    }

    const loanRequests = await LoanRequest.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Book,
          attributes: ["book_id", "title", "authors", "thumbnail"],
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    if (loanRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune demande de prêt trouvée." });
    }

    res.json(
      loanRequests.map((request) => ({
        ...request.toJSON(),
        book: request.book ? request.book.title : "Livre inconnu",
        requestedBy: request.user
          ? request.user.username
          : "Utilisateur inconnu",
        status: request.status,
      }))
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des demandes de prêt :",
      error
    );
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération des demandes de prêt.",
    });
  }
};
module.exports = {
  searchBooks,
  getBookDetails,
  scanBookByIsbn,
  markBookAsAvailable,
  getAvailableBooks,
  requestLoan,
  getLoanRequests,
};
