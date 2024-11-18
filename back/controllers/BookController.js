const axios = require("axios");
const Book = require("../models/Book");
const Category = require("../models/Category");

// Clé API Google Books
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

const searchBooks = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: "Veuillez fournir un terme de recherche." });
  }

  try {
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
      const categoryName = volumeInfo.categories?.[0] || "Uncategorized";

      let category = await Category.findOne({
        where: { category_name: categoryName },
      });

      if (!category) {
        category = await Category.create({ category_name: categoryName });
      }

      const isbn = volumeInfo.industryIdentifiers?.[0]?.identifier;
      if (!isbn) {
        console.warn("Aucun ISBN trouvé pour ce livre.");
        continue;
      }

      const existingBook = await Book.findOne({
        where: { isbn: isbn },
        include: {
          model: Category,
          as: "category",
          attributes: ["category_name"],
        },
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

        const fullBook = await Book.findOne({
          where: { book_id: newBook.book_id },
          include: {
            model: Category,
            as: "category",
            attributes: ["category_name"],
          },
        });

        books.push({
          ...fullBook.toJSON(),
          category_name: fullBook.Category
            ? fullBook.Category.category_name
            : "Uncategorized",
        });
      } else {
        books.push({
          ...existingBook.toJSON(),
          category_name: existingBook.Category
            ? existingBook.Category.category_name
            : "Uncategorized",
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

module.exports = {
  searchBooks,
};
