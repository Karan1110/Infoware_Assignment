const db = require("../startup/db");
const Sequelize = require('sequelize');

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
  timestamps: false
});

module.exports = EmployeeSkill;