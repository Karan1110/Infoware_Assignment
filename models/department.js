const winston = require("winston");
const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");

const Department = db.define("Department", {
  name: Sequelize.STRING,
});

Employee.hasOne(Department, {
  as: 'EmployeeDepartment',
  foreignKey: 'department_id',
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

Department
  .sync({force:true})
  .then(() => {
  winston.info("Department table created");
});

module.exports = Department; 