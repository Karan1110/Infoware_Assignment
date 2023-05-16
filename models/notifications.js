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


Employee.hasMany(
  Notification,
  {
  as: "NotificationEmployee",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
 
Notification
  .sync({ force: true })
  .then(() => {
    winston.info('Notification table created');
  })
  .catch((ex) => { 
    winston.info("NOTIFICATION ERROR",ex);
  }); 

module.exports = Notification;