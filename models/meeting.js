const Sequelize = require('sequelize');
const db = require('../config/database');
const Employee = require('./employee');

const Meeting = db.define('Meeting', {
    type: Sequelize.STRING,
    from: Sequelize.STRING,
    to : Sequelize.STRING
});

Meeting.belongsToMany(Employee, { through: "Meeting_Member" });
Employee.belongsToMany(Meeting, { through: "Meeting_Member" });

Meeting.sync().then(() => {
  winston.info('Meeting table created');
});

module.exports = Meeting;
