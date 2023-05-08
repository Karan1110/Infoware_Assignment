const Sequelize = require('sequelize');
const db = require('../startup/db');
const Benefit_type = require("./benefit_type");
const Employee = require('./employee');

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

Benefit.belongsToMany(Employee, { through: "EmployeeBenefit" });
Employee.belongsToMany(Benefit, { through: "EmployeeBenefit" });

Benefit.sync().then(() => {
  const winston = require("winston")
winston.info('Benefit table created');
});

module.exports = Benefit;