const Sequelize = require('sequelize');
const db = require('../startup/db');

const mailCode = db.define('mailCode', {
  code: Sequelize.STRING,
  email : Sequelize.STRING
});

const winston = require("winston")

mailCode
  .sync({force:true})
  .then(() => {
winston.info('mailCode table created...');
  })
  .catch((ex) => {
    winston.info('mailCode error...',ex)
  });

module.exports = mailCode;