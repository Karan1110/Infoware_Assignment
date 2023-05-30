const Sequelize = require("sequelize");
const db = require("../startup/db");
const ChatRoom = require("./chatRoom");

const Member = db.define(
  "Member",
    {
        chatRoom_id: Sequelize.INTEGER,
        isOnline: Sequelize.BOOLEAN,
        last_seen: Sequelize.DATE
  },
  {
    indexes: [
      {
        fields: ["isOnline"],
      },
    ],
  }
);

Member.hasOne(ChatRoom, {
  as: "chatRoom",
  foreignKey: "chatRoom_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Member;