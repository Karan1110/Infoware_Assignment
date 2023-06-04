const Sequelize = require("sequelize");
const db = require("../startup/db");

const ChatRoom = db.define(
  "ChatRoom",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    employee_id : Sequelize.ARRAY(Sequelize.INTEGER)
  }
);

module.exports = ChatRoom;