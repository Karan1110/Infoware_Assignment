const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth.js")
const User = require("../models/user.js")
const Sequelize = require("sequelize")
const Notification = require("../models/notification.js")
const Performance = require("../models/performance.js")

router.post("/leaves/:id", [auth], async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: "user not found..." })

    const subordinates = await User.findAll({
      where: { department_id: user.department_id },
    })

    if (subordinates && subordinates.length > 0) {
      // Create a notification for each subordinate
      for (const subordinate of subordinates) {
        await Notification.create({
          message: `${user.name} has taken a leave today`,
          user_id: subordinate.id,
        })
      }
    }

    const performance = await Performance.findOne({
      where: { user_id: req.user.id },
    })

    if (performance) {
      // Decrement the points field by 5
      await performance.decrement("points", { by: 5 })
    }

    await User.update(
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

module.exports = router
