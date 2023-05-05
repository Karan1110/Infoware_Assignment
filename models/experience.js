const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');

const Experience = db.define('Experience', {
    company_name: Sequelize.STRING,
    from: Sequelize.STRING,
    to : Sequelize.STRING
});

Employee.belongsToMany(Experience,{through  :"EmployeeExperience"});
Experience.belongsToMany(Employee,{through : "EmployeeExperience"});

Experience.sync().then(() => {
  winston.info('Experience table created');
});

module.exports = Experience;
