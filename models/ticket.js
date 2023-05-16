const winston = require("winston");
const Sequelize = require("sequelize");
const db = require("../startup/db");
const moment = require("moment");
const Employee = require("./employee"); // Move the require statement here
const schedule = require("node-schedule");
const Notification = require("../models/notifications");

const Ticket = db.define(
  "Ticket",
  {
    name: Sequelize.STRING,
    steps: Sequelize.ARRAY(Sequelize.STRING),
    deadline: Sequelize.DATE,
  },
  {
    timestamps: true,
  }
);

Ticket.afterCreate(async (ticket) => {
  const deadline = moment(ticket.deadline);
  const newDate = deadline.subtract(1, "days").format("YYYY-MM-DD HH:MM:SS");
  console.log(ticket.steps);
  await Notification.create({
    message: `Ticket pending! complete now!, name  : ${ticket.name}`,
    employee_id : ticket.employee_id
  });
  schedule.scheduleJob(newDate, async () => {
    await Notification.create({
      message: `Ticket pending! complete now!, name  : ${ticket.name}`,
      employee_id : ticket.employee_id
    });

    schedule.scheduleJob({date : deadline.format('YYYY-MM-DD HH:MM:SS')}, async () => {
      await ticket.destroy();
    });
  });
});

Employee.hasMany(Ticket, {
  as: "Ticket",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Ticket.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Ticket;