const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');

const Meeting = db.define('Meeting', {
    name: Sequelize.STRING,
    from: Sequelize.STRING,
    to: Sequelize.STRING,
    link: Sequelize.STRING,
  });

Meeting.hasOne(Department,{as : "Department",foreignKey : "department_id"})
Meeting.belongsToMany(Employee, { through: "Meeting_Member" });
Employee.belongsToMany(Meeting, { through: "Meeting_Member" });

Meeting.sync().then(() => {
  winston.info('Meeting table created');
});

module.exports = Meeting;
