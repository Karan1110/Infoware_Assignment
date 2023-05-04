const Sequelize = require('sequelize');
const db = require('../config/database');
const Education = require('./education');

const Employee = db.define('Employee', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  age: Sequelize.INTEGER,
  phone: Sequelize.STRING,
  salary: Sequelize.INTEGER,
  isAdmin: Sequelize.BOOLEAN,
  total_working_hours: Sequelize.DATE,
  working_hours_per_day : Sequelize.DATE,
  working_hours: Sequelize.DATE,
  total_leaves: Sequelize.DATE,
  leaves_token : Sequelize.DATE
},{
  indexes: [
    {
      unique: true,
      fields: ['id','name', 'age']
    }
  ]
});

Employee.hasMany(Employee, { as: "manager", forgeinKey: "manager_id" });
Employee.hasOne(Education,{as :"education" ,forgeinKey : "education_type"});


Employee.sync().then(() => {
  winston.info('Employee table created');
});

module.exports = Employee;