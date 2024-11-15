const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Category = require("./Category");

const Book = sequelize.define(
  "Book",
  {
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.TEXT, allowNull: false }, // Modifié pour TEXT
    authors: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: false }, // Modifié pour TEXT[]
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    published_date: { type: DataTypes.DATE },
    description: { type: DataTypes.TEXT }, // Inchangé
    isbn: { type: DataTypes.STRING(30), unique: true }, // Modifié pour accepter jusqu'à 30 caractères
    page_count: { type: DataTypes.INTEGER },
    thumbnail: { type: DataTypes.STRING },
    language: { type: DataTypes.STRING },
    barcode: { type: DataTypes.STRING(100), unique: true }, // Modifié pour accepter jusqu'à 100 caractères
  },
  {
    tableName: "book",
    timestamps: false,
  }
);
Book.belongsTo(Category, { foreignKey: "category_id" });

module.exports = Book;
