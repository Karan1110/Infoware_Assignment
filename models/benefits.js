const Sequelize = require("sequelize");
const db = require("../startup/db");
const Benefit_Type = require("./benefit_type");
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
  console.log(` this is benefit to ${to}`);
  schedule.scheduleJob({ date: to.format("YYYY-MM-DD HH:MM:SS") }, async () => {
    await benefit.destroy();
  });
});

Benefit.hasOne(Benefit_Type, {
  as: "Benefit_Type",
  foreignKey: "benefit_type_id",
});

Employee.hasMany(Benefit, {
  as: "Benefit",
  foreignKey: "employee_id",
});

Benefit.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employee_id",
});

module.exports = Benefit;
