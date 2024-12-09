const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");
const Book = require("./Book");

const LoanRequest = sequelize.define(
  "loan_request",
  {
    request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Book,
        key: "book_id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "user_id",
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "En attente",
    },
    request_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "loan_request",
    freezeTableName: true,
    timestamps: false,
  }
);

LoanRequest.belongsTo(Book, { foreignKey: "book_id" });
LoanRequest.belongsTo(User, { foreignKey: "user_id" });

module.exports = LoanRequest;
