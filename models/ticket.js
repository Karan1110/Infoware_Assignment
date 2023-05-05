const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');

const Ticket = db.define('Ticket', {
    name: Sequelize.STRING,
    steps : Sequelize.ARRAY(Sequelize.STRING)
});

Ticket.hasOne(Employee, { as: " Employee", foreignKey: "employee_id" });
Ticket.belongsTo(Employee, { through: "employee_id" });

Ticket.sync().then(() => {
  winston.info('Ticket table created');
});

module.exports = Ticket;