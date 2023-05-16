const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");
const Department = require("./department");
const MeetingMember = require("./MeetingMember");

const Meeting = db.define("Meeting", {
  name: Sequelize.STRING,
  from: Sequelize.STRING,
  to: Sequelize.STRING,
  link: Sequelize.STRING,
});

const winston = require("winston");

Meeting.belongsTo(Department, {
  as: "MeetingDepartment",
  foreignKey: "department_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Employee.belongsToMany(Meeting, {
  as: "Meeting",
  through: MeetingMember,
  foreignKey: "employee_id",
  otherKey: "meeting_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Meeting.belongsToMany(Employee, {
  as: "Employee",
  through: MeetingMember,
  foreignKey: "meeting_id",
  otherKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});


module.exports = Meeting;