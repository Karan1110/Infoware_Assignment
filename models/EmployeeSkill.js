const db = require("../startup/db");
const Sequelize = require('sequelize');
const winston = require("winston");
const Skill = require("./skills");

const EmployeeSkill = db.define('EmployeeSkill', {
  employee_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  skill_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'EmployeeSkill',
  timestamps: false
});

module.exports = EmployeeSkill;