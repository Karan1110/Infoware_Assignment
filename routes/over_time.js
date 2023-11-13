const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const moment = require("moment")
const isadmin = require("../middlewares/isAdmin")
const Sequelize = require("sequelize")
const Performance = require("../models/performance.js")

router.post("/", [auth, isadmin], async (req, res) => {
  const start = moment(req.body.from).format("YYYY-MM-DDTHH:MM:SS.000Z")
  const end = moment(req.body.to).format("YYYY-MM-DDTHH:MM:SS.000Z")
  const over_time_diff = moment.diff(start, end, "hours")

  const employee = await Employee.update(
    {
      where: {
        id: req.params.id,
      },
    },
    {
      Performance: { points: Sequelize.literal("points + 1") },
      working_hours: literal(`working_hours + ${over_time_diff}`),
    }
  )

  res.status(200).send(employee)
})

module.exports = router
