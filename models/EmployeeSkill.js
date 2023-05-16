const db = require("../startup/db");
const Sequelize = require('sequelize');
const winston = require("winston")

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
  timestamps: false,
  tableName : 'EmployeeSkill'
});




module.exports = EmployeeSkill;