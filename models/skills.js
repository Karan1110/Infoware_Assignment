const Sequelize = require('sequelize');
const Employee = require("./employee");
const db = require('../startup/db');
const winston = require("winston")

const Skill = db.define('Skill', {
    name: {
        type: Sequelize.STRING,
        unique : true
  },
  level : Sequelize.STRING
}, {
    indexes: [
        { 
            unique : true,
            fields : ['name']
        }
    ]
});

Employee.belongsToMany(Skill, { as : "Skill",through: "EmployeeSkill", foreignKey: "employee_id", otherKey: "skill_id" ,onDelete: 'CASCADE',onUpdate: 'CASCADE'});
Skill.belongsToMany(Employee, { as : "Skill",through: "EmployeeSkill", foreignKey: "skill_id", otherKey: "employee_id" ,onDelete: 'CASCADE',onUpdate: 'CASCADE'});

Skill
    .sync()
    .then(() => {
        
winston.info('Skill table created');
    });

module.exports = Skill;