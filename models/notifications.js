const Sequelize = require('sequelize');
const db = require('../config/database');
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
  winston.info('Notification table created');
});

module.exports = Notification;