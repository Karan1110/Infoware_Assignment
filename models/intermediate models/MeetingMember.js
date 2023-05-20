const db = require("../../startup/db");
const Sequelize = require("sequelize");
const Employee = require("../employee");
const Meeting = require("../meeting");

const MeetingMember = db.define(
  " MeetingMember",
  {
    employee_id: {
      type: Sequelize.INTEGER,

      allowNull: false,
    },
    meeting_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    from: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    to: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "MeetingMember",

    timestamps: false,
  }
);

MeetingMember.afterUpdate(async (instance, options) => {
  const { updatedFields } = instance._changed;

  if (updatedFields && updatedFields.includes("to")) {
    const meeting = await Meeting.findOne({ where: { id: meeting_id } });
    const start = moment(meeting.from);
    const end = moment(meeting.to);
    const meetingdiff = end.diff(start, "minutes"); // Calculate the meeting diff in minutes

    const employee_start = moment(this.from);
    const employee_end = moment(this.to);
    const employeediff = employee_end.diff(employee_start, "minutes"); // Calculate the employee's diff in minutes

    const attendedMeetingPercentile =
      ((employeediff / meetingdiff) * 100) / 100; // Calculate the percentile and round to two decimal places

    await Employee.update(
      { id: this.employee_id },
      {
        attended_meetings: Sequelize.literal(
          `attended_meetings +  ${attendedMeetingPercentile}`
        ),
      }
    );
  }
});

module.exports = MeetingMember;
