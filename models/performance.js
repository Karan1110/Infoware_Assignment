const Sequelize = require("sequelize")
const db = require("../startup/db")
const Employee = require("./employee")

const Performance = db.define(
  "Performances",
  {
    status: Sequelize.STRING,
    points: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    classification: {
      type: Sequelize.VIRTUAL,
      get() {
        const points = this.getDataValue("points")
        if (points > 100) {
          return "Above Average"
        } else if (points > 60) {
          return "Average"
        } else {
          return "Below Average"
        }
      },
    },
  },
  {
    indexes: [
      {
        fields: ["status", "points"],
      },
    ],
  }
)

console.log(Employee == db.models.Employee)

Employee.belongsTo(Performance, {
  as: "Performance",
  foreignKey: "performance_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

module.exports = Performance
