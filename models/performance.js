const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');

const Performance = db.define('Performance', {
  status : Sequelize.STRING
}, {
    index : [status]
});

Performance.hasOne(Employee, {
    as: "employee",
    foreignKey : "employee_id"
});

Employee.belongsTo(Performance,{through : "employee_id"});

Performance
    .sync()
    .then(() => {
    const winston = require("winston")
winston.info('Performance table created');
    });

module.exports = Performance;