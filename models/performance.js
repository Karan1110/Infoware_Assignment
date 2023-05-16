const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");

const Performance = db.define(
  "Performance",
  {
    status: Sequelize.STRING,
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["status"],
      },
    ],
  }
);

const winston = require("winston");

Performance.hasMany(Employee, {
  as: "Employee",
  foreignKey: "performance_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Employee.belongsTo(Performance, {
  as: "Performance",
  foreignKey: "performance_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});



module.exports = Performance;