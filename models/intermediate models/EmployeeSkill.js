const db = require("../../startup/db");
const Sequelize = require("sequelize");

const EmployeeSkill = db.define(
  "EmployeeSkill",
  {
    employee_id: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false
    },
    skill_id: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false
    },
  },
  {
    timestamps: false,
    tableName: "EmployeeSkill",
  }
);

module.exports = EmployeeSkill;
