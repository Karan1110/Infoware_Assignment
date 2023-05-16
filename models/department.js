const winston = require("winston");
const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");

const Department = db.define("Department", {
  name: Sequelize.STRING,
});

Department.hasMany(Employee, {
  as: 'Employees',
  foreignKey: 'department_id',
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

Employee.belongsTo(Department, {
  as: 'Department',
  foreignKey: 'department_id',
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

Department
  .sync({ force: true })
  .then(() => {
    winston.info("Department table created...");
  })
  .catch((error) => {
    winston.error("Error creating Department table...", error);
  });

module.exports = Department;