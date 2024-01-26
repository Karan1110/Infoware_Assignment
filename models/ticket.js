const Sequelize = require("sequelize")
const db = require("../startup/db")
const User = require("./user")

const Ticket = db.define(
  "Ticket",
  {
    name: Sequelize.STRING,
    deadline: Sequelize.DATE,
    status: {
      type: Sequelize.ENUM("in-progress", "closed", "open"),
      defaultValue: "open",
    },
    body: Sequelize.TEXT,
    user_id: Sequelize.INTEGER,
    videoUrl: Sequelize.TEXT,
  },
  {
    timestamps: true,
  }
)

User.hasMany(Ticket, {
  as: "Ticket",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Ticket.belongsTo(User, {
  as: "User",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

module.exports = Ticket
