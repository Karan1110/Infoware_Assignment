const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const isadmin = require("../middlewares/isAdmin.js")
const Employee = require("../models/employee")
const Sequelize = require("sequelize")
const MeetingMember = require("../models/MeetingMember")
const Meeting = require("../models/meeting")
const winston = require("winston")
const moment = require("moment")
const Department = require("../models/department.js")

router.get("/", auth, async (req, res) => {
  const meetings = await Meeting.findAll({
    order: [["createdAt", "DESC"]],
    include: {
      model: Department,
      as: "MeetingDepartment",
    },
  })
  res.json(meetings)
})

router.post("/", [auth, isadmin], async (req, res) => {
  let meeting
  try {
    const { meeting_id, employee_id } = req.body

    const employee = await Employee.findByPk(employee_id)
    if (!employee) {
      return res.status(400).send("User not found")
    }

    if (!meeting_id) {
      const startDate = moment(req.body.from) // Replace with your start date
      const endDate = moment(req.body.to) // Replace with your end date

      // Calculate the duration in hours
      const durationInHours = endDate.diff(startDate, "hours")

      meeting = await Meeting.create({
        name: req.body.name,
        link: req.body.link,
        duration: `${durationInHours} hours`,
        department_id: req.body.department_id,
      })
    } else {
      meeting = await Meeting.findByPk(meeting_id)
      if (!meeting)
        return res.status(400).json({ message: "meeting not found..." })
    }

    const m_m = await MeetingMember.findOne({
      where: {
        employee_id: employee_id || req.user.id,
        meeting_id: meeting.dataValues.id || meeting.id,
      },
    })

    if (m_m)
      return res.status(400).json({ message: "already joined the meeting..." })

    await MeetingMember.create({
      employee_id: employee_id || req.user.id,
      meeting_id: meeting.dataValues.id || meeting.id,
    })

    await Employee.update(
      {
        total_meetings: Sequelize.literal(`total_meetings + 1`),
      },
      {
        where: {
          id: employee_id,
        },
      }
    )

    res.status(200).send(meeting)
  } catch (error) {
    console.log("error creating a meeting...", error)
    res.status(500).send("Something failed.")
  }
})

router.put("/", auth, async (req, res) => {
  const employee = await Employee.findByPk(req.body.employee_id)
  if (!employee) {
    return res.status(404).json({ message: "Employee not found..." })
  }
  const meeting = await Meeting.findByPk(req.body.meeting_id)
  if (!meeting) return res.status(404).json({ message: "Meeting not found..." })

  if (employee.attended_meetings) {
    if (employee.attended_meetings === employee.total_meetings) {
      return res.status(400).json({
        message: "Attended meetings can't be more than total meetings",
      })
    }
  } else {
    if (
      employee.dataValues.attended_meetings ===
      employee.dataValues.total_meetings
    ) {
      return res.status(400).json({
        message: "Attended meetings can't be more than total meetings",
      })
    }
  }

  const currentTime = moment()

  // Define the target time (replace with your specific time)
  const targetTime = moment(meeting.to || meeting.dataValues.to)

  // Check if the current time is past the target time
  const isPast = currentTime.isAfter(targetTime)

  if (!isPast) {
    return res.status(400).json({
      message:
        "cannot update meeting attendance before the start of the meeting...",
    })
  }

  await Employee.update(
    {
      total_meetings: Sequelize.literal(`attended_meetings + 1`),
    },
    {
      where: {
        id: req.body.employee_id,
      },
    }
  )
  res.send("updated successfully...")
})

router.put("/:id", [auth, isadmin], async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.body.employee_id)
    if (!employee) {
      return res.status(400).send("User not found")
    }

    const meeting = await Meeting.update(
      {
        name: req.body.name,
        link: req.body.link,
      },
      {
        where: {
          id: req.body.mm_id,
        },
      }
    )

    res.status(200).send(meeting)
  } catch (ex) {
    winston.error(ex)
    res.status(500).send("Something failed.")
  }
})

router.delete("/:id", [auth, isadmin], async (req, res) => {
  try {
    await Meeting.destroy({
      where: {
        id: req.params.id,
      },
    })

    res.status(200).send("Deleted successfully")
  } catch (ex) {
    winston.error(ex)
    res.status(500).send("something failed")
  }
})

module.exports = router
