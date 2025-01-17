const Sequelize = require("sequelize");
const sequelize = require("../database"); // Ton fichier database.js

const Book = require("./Book");
const Category = require("./Category");
const LoanRequest = require("./LoanRequest");

// Associations des modèles
Book.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
LoanRequest.belongsTo(Book, { foreignKey: "bookId", as: "book" });

module.exports = {
  sequelize,
  Book,
  Category,
  LoanRequest,
};
