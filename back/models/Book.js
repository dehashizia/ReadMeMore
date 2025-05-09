const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Category = require("./Category");
const User = require("./User"); // Assurez-vous d'importer User après l'avoir défini

const Book = sequelize.define(
  "Book",
  {
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.TEXT, allowNull: false },
    authors: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    published_date: { type: DataTypes.DATE },
    description: { type: DataTypes.TEXT },
    isbn: { type: DataTypes.STRING(30), unique: true },
    page_count: { type: DataTypes.INTEGER },
    thumbnail: { type: DataTypes.STRING },
    language: { type: DataTypes.STRING },
    barcode: { type: DataTypes.STRING(100), unique: true },
    is_available_for_loan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "book",
    timestamps: false,
  }
);

Book.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Book.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = Book;
