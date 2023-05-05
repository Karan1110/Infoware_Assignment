const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');

const Ticket = db.define('Ticket', {
    name: Sequelize.STRING,
    steps : Sequelize.ARRAY(Sequelize.STRING)
});

Ticket.hasOne(Employee);
Ticket.belongsTo(Employee);

Ticket.sync().then(() => {
  winston.info('Ticket table created');
});

module.exports = Ticket;