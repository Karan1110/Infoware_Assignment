const Sequelize = require('sequelize');
const db = require('../startup/db');
const Benefit_type = require("./benefit_type");
const Employee = require('./employee');
const winston = require("winston");

const Benefit = db.define('Benefit', {
    type: Sequelize.STRING,
    from: Sequelize.STRING,
    to : Sequelize.STRING
});


Benefit.afterCreate(async (instance) => {
   schedule.scheduleJob(instance.to, () => {
    instance.destroy();
  });
});

Benefit.hasOne(Benefit_type, {
  as: "Benefit_type",
  forgeinKey : "Benefit_type_id"
});

Employee.belongsToMany(Benefit, { as : "Benefit",through: "EmployeeBenefit", foreignKey: "employee_id", otherKey: "benefit_id",onDelete: 'CASCADE',onUpdate: 'CASCADE' });
Benefit.belongsToMany(Employee, { as : "Benefit",through: "EmployeeBenefit", foreignKey: "benefit_id", otherKey: "employee_id",onDelete: 'CASCADE',onUpdate: 'CASCADE' });

Benefit.sync({force:true}).then(() => {
winston.info('Benefit table created');
});

module.exports = Benefit;