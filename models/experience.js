const Sequelize = require('sequelize');
const db = require('../config/database');

const Experience = db.define('Experience', {
    company_name: Sequelize.STRING,
    from: Sequelize.STRING,
    to : Sequelize.STRING
});

Experience.sync().then(() => {
  winston.info('Experience table created');
});

module.exports = Experience;
