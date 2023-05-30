const Sequelize = require("sequelize");
const db = require("../startup/db");
const Department = require("./department");

const Position = db.define(
  "Position",
  {
    name: Sequelize.STRING,
  },
  {
    indexes: [
      {
        fields: ["name"],
      },
    ],
  }
);

const winston = require("winston");
Position.hasMany(Department, {
  as: "DepartmentPosition",
  foreignKey: "department_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Department.belongsTo(Position, {
  as: "DepartmentPosition",
  foreignKey: "department_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Position;
