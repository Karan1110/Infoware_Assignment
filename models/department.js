const winston = require("winston");
const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");

const Department = db.define("Department", {
  name: Sequelize.STRING,
});

Employee.belongsTo(Department, {
  as: 'Department',
  foreignKey: 'department_id',
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});


module.exports = Department;