const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const moment = require("moment")
const isadmin = require("../middlewares/isAdmin.js")
const Sequelize = require("sequelize")
const Employee = require("../models/employee.js")

router.post("/:id", [auth, isadmin], async (req, res) => {
  const start = moment(req.body.from)
  const end = moment(req.body.to)
  const over_time_diff = end.diff(start, "hours")

  console.log("Employee ID:", req.params.id)

  const employee = await Employee.update(
    {
      Performance: { points: Sequelize.literal("points + 1") },
      working_hours: Sequelize.literal(
        `total_working_hours + ${over_time_diff}`
      ),
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )

  console.log("Update Result:", employee)

  res.status(200).send(employee)
})

module.exports = router
