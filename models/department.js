const winston = require("winston");
const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");

const Department = db.define("Department", {
  name: Sequelize.STRING,
});

Department.hasMany(Employee, {
  as: "DepartmentEmployee",
  foreignKey: "department_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Employee.belongsTo(Department);

Department
  .sync()
  .then(() => {
  winston.info("Department table created");
});

module.exports = Department;