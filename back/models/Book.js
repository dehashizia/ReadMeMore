// models/Book.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Category = require("./Category"); // Si tu as un modèle Category

const Book = sequelize.define(
  "Book",
  {
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    authors: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    published_date: { type: DataTypes.DATE },
    description: { type: DataTypes.TEXT },
    isbn: { type: DataTypes.STRING, unique: true },
    page_count: { type: DataTypes.INTEGER },
    thumbnail: { type: DataTypes.STRING },
    language: { type: DataTypes.STRING },
    barcode: { type: DataTypes.STRING, unique: true },
  },
  {
    tableName: "book",
    timestamps: false,
  }
);

Book.belongsTo(Category, { foreignKey: "category_id" });

module.exports = Book;
