const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isadmin");
const db = require("../startup/db");
const Employee = require("../models/employee");
const Sequelize = require("sequelize");
const MeetingMember = require("../models/intermediate models/MeetingMember");
const Meeting = require("../models/meeting");
const winston = require("winston");
const moment = require("moment");

router.post("/", [auth, isAdmin], async (req, res) => {
  let transaction;
  let meeting;
  try {
    const { meeting_id, employee_id } = req.body;
    transaction = await db.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    const employee = await Employee.findByPk(employee_id, { transaction });
    if (!employee) {
      await transaction.rollback();
      return res.status(400).send("User not found");
    }

    if (!meeting_id) {
      meeting = await Meeting.create(
        {
          name: req.body.name,
          link: req.body.link,
          from: req.body.from,
          to: req.body.to,
          department_id: req.body.department_id,
          employee_id: req.body.employee_id
        },
        { transaction }
      );
    } else {
      meeting = await Meeting.findByPk(meeting_id);
    }
    console.log(`!!!!`, meeting.dataValues.employee_id,meeting);
    await MeetingMember.create(
      {
        employee_id: employee_id,
        meeting_id:meeting.dataValues.id,
      },
      { transaction }
    );

    await Employee.update(
      {
        total_meetings: Sequelize.literal(`total_meetings + 1`),
      },
      {
        where: {
          id: employee_id,
        },
      }
    );

    await transaction.commit();
    res.status(200).send(meeting);
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log("Transaction rolled back:", error);
    res.status(500).send("Something failed.");
  }
});

router.put("/:id", [auth, isAdmin], async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });
    const employee = await Employee.findByPk(req.body.employee_id, {
      transaction,
    });
    if (!employee) {
      await transaction.rollback();
      return res.status(400).send("User not found");
    }

    const meeting = await Meeting.update(
      {
        where: {
          id: req.body.mm_id,
        },
      },

      {
        name: req.body.name,
        link: req.body.link,
        from: req.body.from,
        to: req.body.to,
      },
      {
        transaction,
      }
    );
    await transaction.commit();
    res.status(200).send(meeting);
  } catch (ex) {
    if (transaction) {
      await transaction.rollback();
    }
    winston.error(ex);
    res.status(500).send("Something failed.");
  }
});

router.put("/", [auth, isAdmin], async (req, res) => {
  let transaction;
  try {
    const { employee_id } = req.body;

    transaction = await db.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    const employee = await Employee.findByPk(employee_id);

    if (!employee) {
      await transaction.rollback();
      return res.status(400).send("User not found");
    }

    const meeting_member = await MeetingMember.findOne({
      where: {
        employee_id: req.body.employee_id,
        meeting_id: req.body.meeting_id,
      }
    });

    const meeting = await Meeting.findByPk(meeting_member.meeting_id);

    // for reference in meeting
    const start = moment(meeting.from);
    const end = moment(meeting.to);
    const meetingDiff = end.diff(start, "minutes"); // Calculate the meeting diff in minutes

    // for reference in meeting_member
    const startt = moment(meeting_member.from);
    const endd = moment(meeting_member.to);
    const meetingDiffMember = endd.diff(startt, "minutes"); // Calculate the meeting diff in minutes

    console.log(`!!!!!!`, meeting_member.dataValues);

    // to add in update
    const employee_start = moment(req.body.from);
    const employee_end = moment(req.body.to);
    const employeeDiff = employee_end.diff(employee_start, "minutes"); // Calculate the employee's diff in minutes

    const attendedMeetingPercentile = (100 / meetingDiff) * employeeDiff; // Calculate the percentile and round to two decimal places
    const attendedMeetingPercentileMember = (100 / meetingDiff) * meetingDiffMember; // Calculate the percentile and round to two decimal places

    // temp for adding in db
    // tempp for reference meeting_member
    const temp = Math.round(attendedMeetingPercentile) / 100;
    const tempp = Math.round(attendedMeetingPercentileMember) / 100;

    console.log(`this is fucking`, temp, tempp);
/*
  // if (temp === 1) {
    //   return res.status(400).send("The employee has already attended the full meeting.");
    // } else
*/
   if (isNaN(tempp) === false) {
      if (tempp === 1 || tempp > 1) {
        return res.status(400).send("The input has exceeded the meeting fraction.")
      }
    }
console.log(isNaN(tempp))
    const m_m = await MeetingMember.update(
      {
        to: req.body.to,
        from: req.body.from,
      },
      {
        where: {
          employee_id: req.body.employee_id,
          meeting_id: req.body.meeting_id,
        },
        transaction
      }
    );

    await Employee.update(
      {
        attended_meetings: Sequelize.literal(`attended_meetings + ${temp}`),
      },
      {
        where: {
          id: employee_id,
        },
        transaction,
      }
    );
    console.log(m_m, meeting_member);
    await transaction.commit();
    res.redirect("/employees/me");
  } catch (ex) {
    if (transaction) {
      await transaction.rollback();
    }
    winston.error(ex);
    res.status(500).send("Something failed.");
  }
});


router.delete("/:id", [auth, isAdmin], async (req, res) => {
  try {
    let transaction;
    transaction = await db.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    await Meeting.destroy(
      {
        where: {
          id: req.params.id,
        },
      },
      {
        transaction,
      }
    );
    await transaction.commit();
    res.status(200).send("Deleted successfully");
  } catch (ex) {
    if (transaction) await transaction.rollback();
    winston.error(ex);
    res.status(500).send("something failed");
  }
});

module.exports = router;
