const Sequelize = require('sequelize');
const db = require('../config/database');

const benefit_type = db.define('benefit_type', {
   name : Sequelize.STRING
});

benefit_type.sync().then(() => {
  winston.info('benefit_type_TYPE table created');
});

module.exports = benefit_type;
