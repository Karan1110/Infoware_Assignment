const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');

const Education = db.define('Education', {
  name: Sequelize.STRING,
  type : Sequelize.STRING
});

Employee.hasOne(Education,{
  as: 'EmployeeEducation',
  foreignKey: 'education_id',
  onUpdate: 'CASCADE',
  onDelete : 'CASCADE'
});

const winston = require("winston")

Education
  .sync({force:true})
  .then(() => {
winston.info('Education table created');
  })
  .catch((ex) => {
    winston.info('education error lolemon',ex)
  });

module.exports = Education;