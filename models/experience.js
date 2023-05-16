const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");

const Experience = db.define("Experience", {
  company_name: Sequelize.STRING,
  from: Sequelize.STRING,
  to: Sequelize.STRING,
});

Employee.belongsToMany(Experience, {
  as: "Experience",
  through: "EmployeeExperience",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Experience.belongsToMany(Employee, {
  as: "Experience",
  through: "EmployeeExperience",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});



const winston = require("winston");



module.exports = Experience;