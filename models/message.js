const Sequelize = require("sequelize")
const db = require("../startup/db")
const Employee = require("./employee")

const Message = db.define(
  "Message",
  {
    message: Sequelize.STRING,
    isRead: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    chatRoom_id: Sequelize.INTEGER,
    channel: Sequelize.STRING,
  },
  {
    timestamps: true,
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
  as: "SentMessages", // Change the alias to "SentMessages"
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Message.belongsTo(Employee, {
  as: "Sender", // Change the alias to "Sender"
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

module.exports = Message

// Message.hasOne(ChatRoom, {
//   as: "chatRoom",
//   foreignKey: "chatRoom_id",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// })
