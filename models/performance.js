const Sequelize = require("sequelize")
const db = require("../startup/db")

const Performance = db.define("Performance", {
  points: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: Sequelize.VIRTUAL,
    get() {
      const points = this.getDataValue("points")
      if (points > 100) {
        return "above average"
      } else if (points > 50) {
        return "average"
      } else if (points > 25) {
        return "below average"
      }
    },
  },
})

module.exports = Performance
