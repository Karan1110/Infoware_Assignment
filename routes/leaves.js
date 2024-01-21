const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const Employee = require("../models/employee")
const isadmin = require("../middlewares/isAdmin.js")
const Sequelize = require("sequelize")
const Notification = require("../models/notifications.js")
const Performance = require("../models/performance.js")

router.post("/leaves/:id", [auth, isadmin], async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.user.id)
    if (!employee) return res.status(404).json({ message: "user not found..." })

    const subordinates = await Employee.findAll({
      where: { department_id: employee.department_id },
    })

    if (subordinates && subordinates.length > 0) {
      // Create a notification for each subordinate
      for (const subordinate of subordinates) {
        await Notification.create({
          message: `${employee.name} has taken a leave today`,
          employee_id: subordinate.id,
        })
      }
    }

    const performance = await Performance.findOne({
      where: { employee_id: req.user.id },
    })

    if (performance) {
      // Decrement the points field by 5
      await performance.decrement("points", { by: 5 })
    }

    await Employee.update(
      {
        total_working_days: Sequelize.literal("total_working_days - 1"),
      },
      { where: { id: req.params.id } }
    )

    res.status(200).send("done!")
  } catch (error) {
    console.error("Error in leaves endpoint:", error.message, error)
    res.status(500).send("Internal Server Error")
  }
})

module.exports = route
