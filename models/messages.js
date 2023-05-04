const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');

const Message = db.define('Message', {
  message  : Sequelize.STRING
}, {
    indexes : [message]
});

Message.hasOne(Employee);
Message.belongsTo(Employee);

Message.sync().then(() => {
  winston.info('Message table created');
});

module.exports = Message;
