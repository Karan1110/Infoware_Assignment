const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');

const Notification = db.define('Notification', {
  message  : Sequelize.STRING
}, {
    indexes : [message]
});

Notification.belongsTo(
  Employee,
  {
    as : "Notifications",
    through: "employee_id",
    onDelete: 'CASCADE',onUpdate: 'CASCADE'
  });

Notification
  .sync()
  .then(() => {
  const winston = require("winston")
winston.info('Notification table created');
});

module.exports = Notification;