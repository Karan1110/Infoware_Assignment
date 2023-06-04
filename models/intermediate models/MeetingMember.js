const db = require("../../startup/db");
const Sequelize = require("sequelize");
const Employee = require("../employee");
const Meeting = require("../meeting");
const moment = require("moment");
const winston = require("winston");

const MeetingMember = db.define(


  " MeetingMember",
  {
    employee_id: {
      type: Sequelize.INTEGER,
      allowNull: false
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
    completed : Sequelize.BOOLEAN
  },
  {
    tableName: "MeetingMember",

    timestamps: false,
  }
);

module.exports = MeetingMember;
