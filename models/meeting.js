const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');
const Department = require('./department');
const MeetingMember = require("./MeetingMember");

const Meeting = db.define('Meeting', {
    name: Sequelize.STRING,
    from: Sequelize.STRING,
    to: Sequelize.STRING,
    link: Sequelize.STRING
});
  
Meeting.hasOne(Department, {
  as: "MeetingDepartment",
  foreignKey: "department_id",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});


Employee.belongsToMany(Meeting, {
  as: "Meeting",
  through:  MeetingMember,
  foreignKey: "employee_id",
  otherKey: "meeting_id",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Meeting.belongsToMany(Employee, {
  as: "Employee",
  through:  MeetingMember,
  foreignKey: "meeting_id",
  otherKey: "employee_id",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

const winston = require("winston");

Meeting
  .sync({ force: true })
  .then(() => {
    MeetingMember.sync({ force: true })
      .then(() => {
        winston.info("MeetingMember created...")
      }).catch((ex) => {
        winston.info('Error creating MeetingMember...', ex)
      });
    winston.info('Meeting table created...');
  })
  .catch((ex) => { 
    winston.error('Meeting table error...',ex);
  });

module.exports = Meeting;

4


4