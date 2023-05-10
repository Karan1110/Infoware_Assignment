const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');

const Education = db.define('Education', {
  name: Sequelize.STRING,
  type : Sequelize.STRING
});

Education.hasMany(Employee, {
  as: "EducationEmployee",
  foreignKey: "employee_id",
  onDelete: 'CASCADE',onUpdate: 'CASCADE'
});

Employee.hasOne(Education);

Education
  .sync()
  .then(() => {
  const winston = require("winston")
winston.info('Education table created');
  });

module.exports = Education;