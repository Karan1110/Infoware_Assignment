const Sequelize = require("sequelize")
const db = require("../startup/db")
const Employee = require("./employee")
const ChatRoom = require("./chatRoom")
const { log } = require("winston/lib/winston/common")
// ChatRoom

const Message = db.define(
  "Message",
  {
    message: Sequelize.STRING,
    isRead: {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Use `defaultValue` instead of `default`
    },
    chatRoom_id: Sequelize.INTEGER,
    channel: Sequelize.STRING,
  },
  {
    indexes: [
      {
        fields: ["message"],
      },
    ],
    hooks: {
      afterCreate: function (message, options) {
        // Your logic after creating a message
      },
      afterUpdate: function (message, options) {
        console.log("hii karu") // Add this log statement
        // Your logic after updating a message
      },
    },
  }
)

Employee.hasMany(Message, {
  as: "Message",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Message.belongsTo(Employee, {
  as: "Message",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

// Message.hasOne(ChatRoom, {
//   as: "chatRoom",
//   foreignKey: "chatRoom_id",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// })
module.exports = Message
