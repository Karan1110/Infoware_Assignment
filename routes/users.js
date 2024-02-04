const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const auth = require("../middlewares/auth.js")
const isadmin = require("../middlewares/isAdmin.js")
const User = require("../models/user.js")
const Ticket = require("../models/ticket.js")
const Meeting = require("../models/meeting.js")
const Notification = require("../models/notification.js")
const Performance = require("../models/performance.js")
const Department = require("../models/department.js")
const { Sequelize, Op } = require("sequelize")
const Review = require("../models/review.js")
const Saved = require("../models/saved.js")
const FollowUser = require("../models/followUser")

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (ex) {
    console.log("ERROR : ")
    console.log(ex)
    res.send("Someting failed.")
  }
})

router.get("/search", auth, async (req, res) => {
  const users = await User.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.iLike]: `%${req.query.user}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${req.query.user}%`,
          },
        },
      ],
    },
  })
  res.json(users)
})

router.get("/colleagues", auth, async (req, res) => {
  const me = await User.findByPk(req.user.id)

  const users = await User.findAll({
    where: {
      department_id: me.department_id || me.dataValues.department_id,
      [Op.not]: {
        id: [req.user.id],
      },
    },
  })

  res.json(users)
})

router.get("/stats", [auth], async (req, res) => {
  try {
    // Average time taken to complete a ticket
    const average_time_taken_to_complete_a_ticket = await Ticket.findAll({
      attributes: [
        [
          Sequelize.literal('("Ticket"."updatedAt" - "Ticket"."createdAt")'),
          "average_time_taken",
        ],
      ],
    })

    res.status(200).send(average_time_taken_to_complete_a_ticket)
  } catch (error) {
    console.error("Error in statistics endpoint:", error.message, error)
    res.status(500).send("Internal Server Error")
  }
})

router.get("/:id", [auth], async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Review,
        as: "Reviews",
      },
      {
        as: "mySavedTickets",
        model: Saved,
        include: [
          {
            as: "savedTicket",
            model: Ticket,
          },
        ],
      },
      {
        model: Notification,
        as: "Notification",
      },
      {
        model: Ticket,
        as: "Ticket",
      },

      {
        model: Meeting,
        as: "Meeting",
      },
      {
        model: Department,
        as: "Department",
      },
      {
        model: Performance,
        as: "Performance",
      },
    ],
  })
  if (!user) return res.status(404).send("user not found")

  const following = await FollowUser.findAll({
    where: {
      followedBy_id: req.params.id,
    },
    include: {
      model: User,
      as: "following",
      attributes: ["name", "email"],
    },
  })
  user.following = following

  const followedBy = await FollowUser.findAll({
    where: {
      following_id: req.params.id,
    },
    include: {
      model: User,
      as: "followedBy",
      attributes: ["name", "email"],
    },
  })
  user.followedBy = followedBy

  res.status(200).send({ user, followedBy, following })
})

router.post("/", async (req, res) => {
  try {
    const userExists = await User.findAll({
      where: {
        email: req.body.email,
      },
    })
    if (userExists && userExists.length > 0) {
      console.log(userExists)
      return res.status(400).send("User already exists...")
    }

    const salt = await bcrypt.genSalt(10)
    const p = await bcrypt.hash(req.body.password, salt)

    const performance = await Performance.create({
      points: 0,
    })

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: p,
      department_id: req.body.department_id,
      performance_id: performance.dataValues.id,
    })

    const token = user.generateAuthToken()

    res.status(201).send({ token: token, User: user })
  } catch (ex) {
    console.log(ex, ex.message)
  }
})

router.put("/:id", auth, async (req, res) => {
  try {
    const authenticatedUser = await User.findByPk(req.user.id)

    if (!authenticatedUser) {
      return res.status(404).send("User Not Found.")
    }

    // const isPasswordValid = await bcrypt.compare(
    //   req.body.password,
    //   authenticatedUser.password
    // )

    // if (!isPasswordValid) {
    //   return res.status(400).send("Invalid credentials.")
    // }

    await authenticatedUser.update({
      name: req.body.name,
    })

    res.status(200).send("updated!")
  } catch (ex) {
    console.log(ex)
    res.status(500).send("Internal Server Error")
  }
})

router.delete("/:id", auth, async (req, res) => {
  const user = await User.destroy({
    where: {
      id: req.params.id,
    },
  })

  res.status(200).send({ Deleted: user })
})

module.exports = router
