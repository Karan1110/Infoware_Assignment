const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const Performance = require("../models/performance.js")
const User = require("../models/user.js")
const Department = require("../models/department.js")

router.get("/leaderboard", async (req, res) => {
  try {
    const performances = await Performance.findAll({
      sort: [["points", "DESC"]],
      include: [
        {
          model: User,
          as: "User",
          include: {
            model: Department,
            as: "Department",
          },
        },
      ],
    })
    res.json(performances)
  } catch (ex) {
    res.send(ex.message)
    console.log("ERROR : ")
    console.log(ex)
  }
})

router.get("/:id", async (req, res) => {
  const performance = await Performance.findByPk(req.params.id)
  if (!performance) return res.status(400).send("not found..")
  res.send(performance)
})

router.put("/:id", auth, async (req, res) => {
  const performance = await Performance.update(
    {
      status: req.body.status,
      points: req.body.points,
    },
    {
      where: {
        id: req.body.user_id,
      },
    }
  )
  res.status(200).send(performance)
})

module.exports = router
