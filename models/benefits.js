const Sequelize = require("sequelize");
const db = require("../startup/db");
const Benefit_Type = require("./benefit_type");
const Employee = require("./employee");
const winston = require("winston");
const moment = require("moment");

const Benefit = db.define("Benefit", {
  from: Sequelize.DATE,
  to: Sequelize.DATE,
  benefit_type_id: Sequelize.INTEGER,
});

Benefit.afterCreate(async (benefit) => {
  try {
    const d = new Date(
      benefit.to.getUTCFullYear(),
      benefit.to.getUTCMonth(),
      benefit.to.getUTCDate(),
      benefit.to.getUTCHours(),
      benefit.to.getUTCMinutes(),
      benefit.to.getUTCSeconds()
    );
    const time_out = d.getTime() - Date.now();

    setTimeout(async () => {
      console.log("Event firing...");
      await benefit.destroy();
    }, time_out);
  } catch (ex) {
    winston.info(ex);
  }
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
