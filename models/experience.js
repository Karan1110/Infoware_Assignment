const Sequelize = require("sequelize");
const db = require("../startup/db");

const Experience = db.define("Experience", {
  employee_id: {
    type: Sequelize.INTEGER,
    foreignKey : true
  },
  company_name: Sequelize.STRING,
  from: Sequelize.DATE,
  to: Sequelize.DATE
});

module.exports = Experience;