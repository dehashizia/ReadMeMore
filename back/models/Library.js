// models/Library.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");
const Book = require("./Book");

const Library = sequelize.define(
  "Library",
  {
    library_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    book_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false }, // "read", "reading", "want to read", etc.
  },
  {
    tableName: "library",
    timestamps: false,
  }
);

Library.belongsTo(User, { foreignKey: "user_id" });
Library.belongsTo(Book, { foreignKey: "book_id" });

module.exports = Library;
