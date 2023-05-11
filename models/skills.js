const Sequelize = require('sequelize');
const winston = require("winston")
const db = require('../startup/db');
const EmployeeSkill = require("./EmployeeSkill");
const Employee = require("./employee");

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

  Employee.belongsToMany(Skill, { through: EmployeeSkill, foreignKey: 'employee_id', otherKey: 'skill_id' });


Skill
    .sync({ force: true })
    .then(() => {
EmployeeSkill
.sync({ force: true })
    .then(() => {
      winston.info('EmployeeSkill table created');
    })
    .catch((err) => {
      console.log("Can't create EmployeeSkill", err);
    });

}).catch((err) => {
    
});

module.exports = Skill;