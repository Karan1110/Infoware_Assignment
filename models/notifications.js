const Sequelize = require('sequelize');
const db = require('../startup/db');
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

Employee.hasMany(
  Notification,
  {
  as: "Notification",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});    

module.exports = Notification;