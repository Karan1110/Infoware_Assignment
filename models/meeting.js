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
  

Meeting.prototype.createMeetingMember = async function (employee_id) {
  await this.addEmployee(employee_id);
  await Notification.create({
    message: "new meeting scheduled",
    employeeId: employee_id
  });
};

Meeting.hasOne(Department,{as : "MeetingDepartment",foreignKey : "department_id",onDelete: 'CASCADE',onUpdate: 'CASCADE'})
Meeting.belongsToMany(Employee, { as : "MeetingEmployee",through: "Meeting_Member" , forgeinKey:"employee_id",otherKey  :"meeting_id",onDelete: 'CASCADE',onUpdate: 'CASCADE'});
Employee.belongsToMany(Meeting, { as : "Meeting",through: "Meeting_Member", forgeinKey: "meeting_id", otherKey: "employee_id" ,onDelete: 'CASCADE',onUpdate: 'CASCADE'});

Meeting.afterCreate(async (instance) => {
  
 await  Notification.create({
    message: "new meeting scheduled"
  });
});


Meeting.sync().then(() => {
  const winston = require("winston")
winston.info('Meeting table created');
});

module.exports = Meeting;