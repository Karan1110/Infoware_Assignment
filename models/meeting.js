const Sequelize = require('sequelize');
const db = require('../config/database');
const meeting_member = require("./meeting_member");

const Meeting = db.define('Meeting', {
    type: Sequelize.STRING,
    from: Sequelize.STRING,
    to : Sequelize.STRING
});

Meeting.hasMany(meeting_member);

Meeting.sync().then(() => {
  winston.info('Meeting table created');
});

module.exports = Meeting;
