const Sequelize = require('sequelize');
const db = require('../config/database');
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
    winston.info('Performance table created');
    });

module.exports = Performance;