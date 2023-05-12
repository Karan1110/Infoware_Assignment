const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');
const Department = require('./department');
const Meeting_Member = require("./MeetingMember");

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

Meeting.belongsToMany(Employee, {
  as: "MeetingEmployee",
  through: "Meeting_Member",
  foreignKey: "meeting_id",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Employee.belongsToMany(Meeting, {
  as: "Meeting",
  through: "Meeting_Member",
  foreignKey: "employee_id",
  otherKey: "meeting_id",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
 


Meeting.createMeetingMember = async function (employee_id) {
  await this.addMeetingEmployee(employee_id);
  await Notification.create({
    message: "new meeting scheduled",
    employee_id: employee_id
  });
};

const winston = require("winston");

Meeting
  .sync({ force: true })
  .then(() => {
    Meeting_Member
      .sync({ force: true })
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