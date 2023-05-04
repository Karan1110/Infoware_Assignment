const Sequelize = require('sequelize');
const db = require('../config/database');
const Meeting = require('./meeting');

const MeetingMember = db.define('MeetingMember', {});

MeetingMember.belongsTo(Meeting);

MeetingMember.sync().then(() => {
  winston.info('MeetingMember table created');
});

module.exports = MeetingMember;
