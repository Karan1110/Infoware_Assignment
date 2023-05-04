const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');

const ticket = db.define('ticket', {
    name: Sequelize.STRING,
    steps : Sequelize.ARRAY(Sequelize.STRING)
});

ticket.hasOne(Employee);
ticket.belongsTo(Employee);

ticket.sync().then(() => {
  winston.info('ticket table created');
});

module.exports = ticket;
