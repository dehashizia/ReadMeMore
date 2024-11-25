const axios = require("axios");
const { Op } = require("sequelize");
const Book = require("../models/Book");
const Category = require("../models/Category");

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
        : "Uncategorized",
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
};

module.exports = {
  searchBooks,
  getBookDetails,
};
