const Sequelize = require("sequelize");
const db = require("../startup/db");
const EmployeeSkill = require("./intermediate models/EmployeeSkill");
const Employee = require("./employee");

const Skill = db.define("Skill",{
    name: {
      type: Sequelize.STRING,
      unique: true
    },
    level: Sequelize.STRING
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["name"]
      }
    ],
  }
);

Skill.hasMany(EmployeeSkill, { foreignKey: 'skill_id' });
Employee.hasMany(EmployeeSkill, { foreignKey: 'employee_id' });

Employee.belongsToMany(Skill, {
  through: EmployeeSkill,
  foreignKey: "employee_id",
  as : "Skill"
});

Skill.belongsToMany(Employee, {
  through: EmployeeSkill,
  foreignKey: "skill_id",
  as : "Employee"
});

module.exports = Skill;
