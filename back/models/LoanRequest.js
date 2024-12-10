const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");
const Book = require("./Book");

const LoanRequest = sequelize.define(
  "loan_request", // Nom du modèle
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
      defaultValue: "En attente", // La demande est par défaut "En attente"
    },
    request_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "loan_request", // Nom exact de la table dans la base de données
    freezeTableName: true, // Empêche Sequelize de pluraliser automatiquement
    timestamps: false, // Désactive les colonnes createdAt et updatedAt
  }
);

// Associations
LoanRequest.belongsTo(Book, { foreignKey: "book_id" });
LoanRequest.belongsTo(User, { foreignKey: "user_id", as: "RequestingUser" });

module.exports = LoanRequest;
