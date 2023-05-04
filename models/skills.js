const Sequelize = require('sequelize');
const db = require('../config/database');

const Skill = db.define('Skill', {
    name: {
        type: Sequelize.STRING,
        unique : true
  },
  level : Sequelize.STRING
}, {
    index : [id,name]
});

Skill
    .sync()
    .then(() => {
    winston.info('Skill table created');
    });

module.exports = Skill;