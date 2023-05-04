const Sequelize = require('sequelize');
const db = require('../config/database');
const benefit_type = require("./benefit_type");

const Benefit = db.define('Benefit', {
    type: Sequelize.STRING,
    from: Sequelize.STRING,
    to : Sequelize.STRING
});

Benefit.hasOne(benefit_type);

Benefit.sync().then(() => {
  winston.info('Benefit table created');
});

module.exports = Benefit;
