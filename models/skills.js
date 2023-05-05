const Sequelize = require('sequelize');
const db = require('../config/database');

const Skill = db.define('Skill', {
    name: {
        type: Sequelize.STRING,
        unique : true
  },
  level : Sequelize.STRING
}, {
    index : [id,name]
});

Employee.belongsToMany(Skill, { through: EmployeeSkill });
Skill.belongsToMany(Employee, { through: EmployeeSkill });

Skill
    .sync()
    .then(() => {
    winston.info('Skill table created');
    });

module.exports = Skill;