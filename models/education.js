const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');

const Education = db.define('Education', {
  name: Sequelize.STRING,
  type : Sequelize.STRING
});

Education.hasMany(Employee, {
  as: "employee",
  foreignKey: "employee_id"
});

Employee.hasOne(Education,{as : "Education",foreignKey  :"education_id"});

Education
  .sync()
  .then(() => {
  winston.info('Education table created');
  });

module.exports = Education;