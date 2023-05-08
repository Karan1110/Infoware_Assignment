const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');

const Performance = db.define('Performance', {
  status : Sequelize.STRING
}, {
    index : [status]
});

Performance.hasOne(Employee, {
    as: "Employee",
    foreignKey : "employee_id"
});

Employee.belongsTo(Performance,{as  : "Performance",through : "employee_id",onDelete: 'CASCADE',onUpdate: 'CASCADE'});

Performance
    .sync()
    .then(() => {
    const winston = require("winston")
winston.info('Performance table created');
    });

module.exports = Performance;