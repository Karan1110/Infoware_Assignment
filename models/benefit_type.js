const Sequelize = require('sequelize');
const db = require('../startup/db');

const Benefit_type = db.define('Benefit_type', {
   name : Sequelize.STRING
},{
  indexes: [
    {
      fields: ['name']
    }
  ]
});

module.exports = Benefit_type;