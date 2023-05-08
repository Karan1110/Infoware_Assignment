const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');

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



Meeting.hasOne(Department,{as : "Department",foreignKey : "department_id"})
Meeting.belongsToMany(Employee, { through: "Meeting_Member" , forgeinKey:"employee_id",otherKey  :"meeting_id"});
Employee.belongsToMany(Meeting, { through: "Meeting_Member", forgeinKey: "meeting_id", otherKey: "employee_id" });

Meeting.afterCreate(async (instance) => {
  
  Notification.create({
    message: "new meeting scheduled"
  });
});


Meeting.sync().then(() => {
  const winston = require("winston")
winston.info('Meeting table created');
});

module.exports = Meeting;
