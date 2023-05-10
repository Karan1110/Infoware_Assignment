const Sequelize = require('sequelize');
const db = require('../startup/db');
const winston = require("winston")
const Employee = require('./employee');

const Notification = db.define('Notification', {
  message  : Sequelize.STRING
}, {
  indexes: [
    {
        fields : ['message']
      }
    ]
});

Notification.belongsTo(
  Employee,
  {
  as: "NotificationEmployee",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});


Employee.hasMany(Notification);

Notification
  .sync()
  .then(() => {
winston.info('Notification table created');
});

module.exports = Notification;