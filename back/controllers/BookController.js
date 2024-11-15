const axios = require("axios");
const Book = require("../models/Book");
const Category = require("../models/Category");
// Clé API Google Books
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

// Fonction pour chercher des livres
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
        books.push(newBook);
      } else {
        books.push(existingBook);
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
