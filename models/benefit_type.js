const Sequelize = require('sequelize');
const db = require('../startup/db');
const winston = require("winston");

const Benefit_Type = db.define('Benefit_Type', {
   name : Sequelize.STRING
},{
  indexes: [
    {
      fields: ['name']
    }
  ]
});



module.exports = Benefit_Type;