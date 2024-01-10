const winston = require("winston")
const Sequelize = require("sequelize")
const db = require("../startup/db")
const Employee = require("./employee")
const Notification = require("../models/notifications")
const moment = require("moment")

const Ticket = db.define(
  "Ticket",
  {
    name: Sequelize.STRING,
    steps: Sequelize.ARRAY(Sequelize.STRING),
    deadline: Sequelize.DATE,
    completed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
)
// Ticket.

Ticket.afterCreate(async (ticket) => {
  try {
    console.log("lolll")
  } catch (ex) {
    winston.info(ex)
  }
})

Employee.hasMany(Ticket, {
  as: "Ticket",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Ticket.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

module.exports = Ticket
