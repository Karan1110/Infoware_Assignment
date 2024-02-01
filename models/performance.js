const Sequelize = require("sequelize")
const db = require("../startup/db")

const Performance = db.define("Performance", {
  points: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  user_id: Sequelize.INTEGER,
})

module.exports = Performance
