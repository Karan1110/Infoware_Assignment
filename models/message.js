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

Employee.hasMany(Message, {
  as: "Message",
  foreignKey: "employee_id",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Message.belongsTo(Employee);

const winston = require("winston")

winston.info('Message table created');

Message
    .sync({ force: true })
    .then(() => {
      winston.info('created Message table.');
    }) .catch((ex) => { 
  winston.info('ERROR creating Message table.');
});

module.exports = Message;
