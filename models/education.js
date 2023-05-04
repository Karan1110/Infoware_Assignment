const Sequelize = require('sequelize');
const db = require('../config/database');

const Education = db.define('Education', {
  name: Sequelize.STRING,
  type : Sequelize.STRING
});

Education.sync().then(() => {
  winston.info('Education table created');
});

module.exports = Education;
