const Sequelize = require('sequelize');
const db = require('../config/database');

const Performance = db.define('Performance', {
    name: {
        type: Sequelize.STRING,
        allowNull : false
  },
  status : Sequelize.STRING
}, {
    index : [name]
});

Performance
    .sync()
    .then(() => {
    winston.info('Performance table created');
    });

module.exports = Performance;