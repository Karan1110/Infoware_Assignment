const Sequelize = require("sequelize");
const winston = require("winston");
const db = require("../startup/db");
const EmployeeSkill = require("./intermediate models./EmployeeSkill");
const Employee = require("./employee");

const Skill = db.define(
  "Skill",
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
    level: Sequelize.STRING,
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
    ],
  }
);
Employee.belongsToMany(Skill, {
  through: EmployeeSkill,
  foreignKey: "employee_id"
});
Skill.belongsToMany(Employee, {
  through: EmployeeSkill,
  foreignKey: "skill_id"
});


module.exports = Skill;