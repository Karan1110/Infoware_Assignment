const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');
const Department = require('./department');

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

Meeting.sync({force:true}).then(() => {
  const winston = require("winston")
winston.info('Meeting table created');
});

module.exports = Meeting;