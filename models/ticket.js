const Sequelize = require("sequelize")
const db = require("../startup/db")
const Employee = require("./employee")

const Ticket = db.define(
  "Ticket",
  {
    name: Sequelize.STRING,
    steps: Sequelize.ARRAY(Sequelize.STRING),
    deadline: Sequelize.DATE,
    status: {
      type: Sequelize.ENUM("in-progress", "closed", "open"),
      defaultValue: "open",
    },
    body: Sequelize.TEXT,
    employee_id: Sequelize.INTEGER,
    videoUrl: Sequelize.TEXT,
  },
  {
    timestamps: true,
  }
)

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
