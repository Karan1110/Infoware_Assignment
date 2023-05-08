const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');
const Position = require('./position');

const Department = db.define('Department', {
  name: Sequelize.STRING
});

Department.hasMany(
    Employee, { as: "Department", foreignKey: "department_id" }
);

Department.hasOne(
  Position, { as: "Position", foreignKey: "position_id" }
);

Department.sync().then(() => {
  const winston = require("winston")
winston.info('Department table created');
});

module.exports = Department;