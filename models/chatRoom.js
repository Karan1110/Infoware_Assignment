const Sequelize = require("sequelize")
const db = require("../startup/db")

const ChatRoom = db.define(
  "ChatRoom",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    employee_id: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: [],
    },
    channels: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
    },
    type: Sequelize.ENUM("channel", "group"),
  },
  {
    tableName: "chat_rooms", // Replace with your actual table name
    timestamps: true,
    underscored: true, // Use underscores instead of camelCase for column names
  }
)

module.exports = ChatRoom
