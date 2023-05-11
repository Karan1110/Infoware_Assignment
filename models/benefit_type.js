const Sequelize = require('sequelize');
const db = require('../startup/db');
const winston = require("winston");

const Benefit_type = db.define('Benefit_type', {
   name : Sequelize.STRING
},{
  indexes: [
    {
      fields: ['name']
    }
  ]
});

Benefit_type
  .sync({force:true})
  .then(() => {
winston.info('Benefit_type_TYPE table created');
});

module.exports = Benefit_type;