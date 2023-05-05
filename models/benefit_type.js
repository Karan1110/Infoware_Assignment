const Sequelize = require('sequelize');
const db = require('../config/database');

const Benefit_type = db.define('Benefit_type', {
   name : Sequelize.STRING
});

Benefit_type.sync().then(() => {
  winston.info('Benefit_type_TYPE table created');
});

module.exports = Benefit_type;
