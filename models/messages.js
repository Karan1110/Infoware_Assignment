const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');

const Message = db.define('Message', {
  message: Sequelize.STRING,
  read: {
    type: Sequelize.BOOLEAN,
    default : false
  }
}, {
    indexes : [message]
});

Employee.hasMany(Message, { foreignKey: "employee_id" ,onDelete: 'CASCADE',onUpdate: 'CASCADE'});

Message.sync().then(() => {
  winston.info('Message table created');
});

module.exports = Message;