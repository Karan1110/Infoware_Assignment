const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');

const Performance = db.define('Performance', {
    name: {
        type: Sequelize.STRING,
        allowNull : false
  },
  status : Sequelize.STRING
}, {
    index : [name]
});

Performance.hasOne(Employee, {
    as: "employee",
    foreignKey : "employee_id"
});

Performance.belongsTo(Employee);

Performance
    .sync()
    .then(() => {
    winston.info('Performance table created');
    });

module.exports = Performance;