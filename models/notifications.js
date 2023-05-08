const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');

const Notification = db.define('Notification', {
  message  : Sequelize.STRING
}, {
    indexes : [message]
});

Notification.hasOne(
  Employee, {
    as: "Employee",
    foreignKey: "employee_id"
  });

Notification.belongsTo(
  Employee,
  {
    through: "employee_id"
  });

Notification.sync().then(() => {
  const winston = require("winston")
winston.info('Notification table created');
});

module.exports = Notification;