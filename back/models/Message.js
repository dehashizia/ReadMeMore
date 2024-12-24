const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");
const LoanRequest = require("./LoanRequest");

const Message = sequelize.define(
  "message",
  {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    loan_request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: LoanRequest,
        key: "request_id",
      },
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "message",
    timestamps: false, // nom de la table
  }
);

Message.belongsTo(User, { as: "sender", foreignKey: "sender_id" });
Message.belongsTo(User, { as: "recipient", foreignKey: "recipient_id" });

module.exports = Message;
