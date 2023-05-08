const Sequelize = require('sequelize');
const db = require('../startup/db');
const winston = require("winston")

const Skill = db.define('Skill', {
    name: {
        type: Sequelize.STRING,
        unique : true
  },
  level : Sequelize.STRING
}, {
    index : [id,name]
});

Employee.belongsToMany(Skill, { as : "Skill",through: "EmployeeSkill", foreignKey: "employee_id", otherKey: "skill_id" });
Skill.belongsToMany(Employee, { as : "Skill",through: "EmployeeSkill", foreignKey: "skill_id", otherKey: "employee_id" });

Skill
    .sync()
    .then(() => {
        
winston.info('Skill table created');
    });

module.exports = Skill;