const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');

const Performance = db.define('Performance', {
  status : Sequelize.STRING
}, {
    index: [
        {
            unique : false,
            fields : ['status']
        }
    ]
});

Employee.belongsTo(Performance);

Performance.hasOne(Employee, {
    as: "PerformanceEmployee",
    foreignKey : "employee_id"
});

Performance
    .sync()
    .then(() => {
    const winston = require("winston")
winston.info('Performance table created');
    });

module.exports = Performance;