const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');
const Position = require('./position');

const department = db.define('department', {
  name: Sequelize.STRING
});

department.hasMany(
    Employee, { as: "employee", foreignKey: "employee_id" }
);
department.hasOne(
    Position, { as: "Position", foreignKey: "position_id" }
)

department.sync().then(() => {
  winston.info('department table created');
});

module.exports = department;