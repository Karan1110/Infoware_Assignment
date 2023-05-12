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

Employee.hasOne(Performance, {
    as: "Performance",
    foreignKey: "employee_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
  
  const winston = require("winston")
  
Performance
    .sync({force:true})
    .then(() => {
winston.info('Performance table created');
    });

module.exports = Performance;