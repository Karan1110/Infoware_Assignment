const winston = require("winston");
const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");
const Notification = require("../models/notifications");
const moment = require("moment");

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
);
// Ticket.

Ticket.afterCreate(async (ticket) => {
  try {
    const d = new Date(
      ticket.deadline.getUTCFullYear(),
      ticket.deadline.getUTCMonth(),
      ticket.deadline.getUTCDate(),
      ticket.deadline.getUTCHours(),
      ticket.deadline.getUTCMinutes(),
      ticket.deadline.getUTCSeconds()
    );

    const start_date = moment(d).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const s = new Date(start_date);

    const time_out = s.getTime() - Date.now();

    setTimeout(async () => {
      console.log("Event firing...");
      await ticket.destroy();
    }, time_out);

    const time_out_ii = s;
    time_out_ii.setDate(s.getDate() - 1);
    console.log(time_out_ii);
    const real_timeout = time_out_ii.getTime() - Date.now();

    setTimeout(async () => {
      await Notification.create({
        message: `Ticket pending! complete now! ${ticket.name}`,
        employee_id: ticket.employee_id,
      });
    }, real_timeout);
  } catch (ex) {
    winston.info(ex);
  }
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
