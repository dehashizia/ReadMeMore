const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");
const Book = require("./Book");

const LoanRequest = sequelize.define(
  "LoanRequest",
  {
    loan_request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    requester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "pending", // Par défaut, la demande est en attente
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "loan_request",
    timestamps: false,
  }
);

LoanRequest.belongsTo(User, { foreignKey: "requester_id", as: "requester" });
LoanRequest.belongsTo(Book, { foreignKey: "book_id", as: "book" });

module.exports = LoanRequest;
