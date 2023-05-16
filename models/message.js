const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');

const Message = db.define('Message', {
  message: Sequelize.STRING,
  read: {
    type: Sequelize.BOOLEAN,
    default : false
  }
}, {
  indexes: [
    {
      fields: ['message']
    }
  ]
});

const winston = require("winston")

winston.info('Message table created');

Employee.hasMany(Message, {
  as: "Message",
  foreignKey: "employee_id",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Message.belongsTo(Employee, {
  as: "Message",
  foreignKey: "employee_id",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});


module.exports = Message;
