const Sequelize = require("sequelize");
const db = require("../startup/db");

const mailCode = db.define("mailCode", {
  code: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = mailCode;