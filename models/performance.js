const Sequelize = require("sequelize")
const db = require("../startup/db")
const Performance = db.define(
  "Performance",
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
    tablename: "Performances",
    modelName: "Performance",
    indexes: [
      {
        fields: ["status", "points"],
      },
    ],
  }
)

console.log(Performance == db.models.Performance)
console.log(db.models.Performance)

module.exports = Performance
