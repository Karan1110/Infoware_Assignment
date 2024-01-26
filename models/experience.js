const Sequelize = require("sequelize")
const db = require("../startup/db")

const Experience = db.define("Experience", {
  user_id: {
    type: Sequelize.INTEGER,
    foreignKey: true,
  },
  company: Sequelize.STRING,
  from: Sequelize.DATE,
  to: Sequelize.DATE,
})

module.exports = Experience
