const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role_id: { type: DataTypes.INTEGER, defaultValue: 1 },
    emailConfirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true, // Cette colonne peut être nulle si l'utilisateur n'a pas de photo
      defaultValue: null, // Optionnel : tu peux définir une valeur par défaut si besoin
    },
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

module.exports = User;
