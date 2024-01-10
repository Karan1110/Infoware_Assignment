const Sequelize = require("sequelize")
const db = require("../startup/db")
const Department = require("./department")

const Position = db.define(
  "Position",
  {
    name: Sequelize.STRING,
    department_id: Sequelize.INTEGER,
  },
  {
    indexes: [
      {
        fields: ["name"],
      },
    ],
  }
)

Position.belongsTo(Department, {
  as: "DepartmentPosition",
  foreignKey: "department_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

module.exports = Position
