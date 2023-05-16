const db = require("../startup/db");
const Sequelize = require('sequelize');

const MeetingMember = db.define(' MeetingMember', {
  employee_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  meeting_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports =  MeetingMember;