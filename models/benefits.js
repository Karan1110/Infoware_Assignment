const Sequelize = require("sequelize");
const db = require("../startup/db");
const Benefit_type = require("./benefit_type");
const Employee = require("./employee");
const winston = require("winston");
const schedule = require("node-schedule");
const moment = require("moment");

const Benefit = db.define("Benefit", {
  from: Sequelize.DATE,
  to: Sequelize.DATE,
  benefit_type_id: Sequelize.INTEGER,
});

Benefit.afterCreate(async (benefit) => {
  const to = moment(benefit.to);
  const year = to.year();
  const month = to.month();
  schedule.scheduleJob({year : year ,month:month,hour:6,minute:0}, () => {
   benefit.destroy();
  });
});


Benefit.hasOne(Benefit_type, {
  as: "Benefit_type",
  foreignKey: "benefit_type_id", 
});

Employee.hasMany(Benefit, {
  as: "EmployeeBenefit",
  foreignKey: "employee_id",
});

Benefit.belongsTo(Employee, {
  as: "EmployeeBenefit",
  foreignKey: "employee_id",
});

Benefit_type
  .sync({ force: true })
  .then(() => {
    Benefit.sync({ force: true })
      .then(() => {
        winston.info("Benefit table created");
      })
      .catch((ex) => {
        winston.info('benefitTable',ex);
      });
    winston.info("Benefit_type table created");
  })
  .catch((ex) => {
    winston.info('Benefit table',ex);
  });

module.exports = Benefit;
