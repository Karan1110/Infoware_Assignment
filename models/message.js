const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");
const ChatRoom = require("./chatRoom");
// ChatRoom

const Message = db.define( 
  "Message",
  {
    message: Sequelize.STRING,
    isRead: {
      type: Sequelize.BOOLEAN,
      default: false
    },
    chatRoom_id: Sequelize.INTEGER
  },
  {
    indexes: [
      {
        fields: ["message"],
      },
    ],
  }
);

Employee.hasMany(Message, {
  as: "Message",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

Message.belongsTo(Employee, {
  as: "Message",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Message.hasOne(ChatRoom, {
  as: "chatRoom",
  foreignKey: "chatRoom_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
})
  ;
module.exports = Message;