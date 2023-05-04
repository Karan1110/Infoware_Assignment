const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');

const Notification = db.define('Notification', {
  message  : Sequelize.STRING
}, {
    indexes : [message]
});

Notification.hasOne(Employee);
Notification.belongsTo(Employee);

Notification.sync().then(() => {
  winston.info('Notification table created');
});

module.exports = Notification;