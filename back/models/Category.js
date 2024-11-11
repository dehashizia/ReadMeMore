const { DataTypes } = require("sequelize");
const sequelize = require("../database"); // Assure-toi que sequelize est bien configuré

const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Assure-toi que cela correspond bien au comportement de ta table (SERIAL)
    },
    category_name: {
      type: DataTypes.STRING(50), // Correspond à la taille de category_name (VARCHAR(50))
      allowNull: false, // Assure-toi que le champ ne peut pas être nul
    },
  },
  {
    tableName: "category", // Correspond à ton nom de table
    timestamps: false, // Pas de colonnes createdAt/updatedAt dans ta table
  }
);

module.exports = Category;
