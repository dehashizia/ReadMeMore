const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");
const Book = require("./Book");

const Comment = sequelize.define(
  "Comment",
  {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "comment",
    timestamps: false,
  }
);

Comment.belongsTo(User, { foreignKey: "user_id", as: "user" });
Comment.belongsTo(Book, { foreignKey: "book_id", as: "book" });

module.exports = Comment;
