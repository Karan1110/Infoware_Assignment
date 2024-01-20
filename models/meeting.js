const Sequelize = require("sequelize")
const db = require("../startup/db")
const Employee = require("./employee")
const Department = require("./department")
const MeetingMember = require("./intermediate models/MeetingMember")

const Meeting = db.define(
  "Meeting",
  {
    name: Sequelize.STRING,
    duration: Sequelize.STRING,
    link: Sequelize.STRING,
    department_id: Sequelize.INTEGER,
  },
  {
    timestamps: true,
  }
)

Meeting.belongsTo(Department, {
  as: "MeetingDepartment",
  foreignKey: "department_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Meeting.belongsToMany(Employee, {
  as: "Participants",
  through: MeetingMember,
  foreignKey: "meeting_id",
  otherKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Employee.belongsToMany(Meeting, {
  as: "Meeting",
  through: MeetingMember,
  foreignKey: "employee_id",
  otherKey: "meeting_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

MeetingMember.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "MeetingMemberEmployee",
})

MeetingMember.belongsTo(Meeting, {
  foreignKey: "meeting_id",
  as: "MeetingMemberMeeting",
})

module.exports = Meeting
