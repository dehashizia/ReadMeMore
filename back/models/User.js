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
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

module.exports = User;
