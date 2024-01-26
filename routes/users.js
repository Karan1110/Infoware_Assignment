const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const auth = require("../middlewares/auth.js")
const isadmin = require("../middlewares/isAdmin.js")
const Skill = require("../models/skills.js")
const User = require("../models/user.js")
const Experience = require("../models/experience.js")
const Ticket = require("../models/ticket.js")
const moment = require("moment")
const Meeting = require("../models/meeting.js")
const Notification = require("../models/notification.js")
const Performance = require("../models/performance.js")
const Department = require("../models/department.js")
const { Sequelize, Op } = require("sequelize")
const Review = require("../models/review.js")

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
router.get("/average_salary", [auth, isadmin], async (req, res) => {
  const Users = await User.findAll({
    attributes: [
      [Sequelize.fn("AVG", Sequelize.col("salary")), "average_salary"],
    ],
  })

  res.status(200).send(Users[0])
})

router.get("/search", auth, async () => {
  const users = await User.findAll({
    where: {
      name: {
        [Sequelize.Op.iLike]: `%${req.query.user}%`, // Using Sequelize's Op.like for a partial match
      },
    },
  })
  res.json(users)
})

router.get("/statistics", [auth, isadmin], async (req, res) => {
  try {
    const statistics = {}

    // Performance statistics
    statistics.below_average_performances = await User.findAll({
      include: [
        {
          model: Performance,
          as: "Performance",
          where: {
            points: {
              [Op.lte]: 25,
            },
          },
        },
      ],
    })

    statistics.average_performances = await User.findAll({
      include: [
        {
          model: Performance,
          as: "Performance",
          where: {
            points: {
              [Op.gt]: 25,
              [Op.lte]: 75,
            },
          },
        },
      ],
    })

    statistics.above_average_performances = await User.findAll({
      include: [
        {
          model: Performance,
          as: "Performance",
          where: {
            points: {
              [Op.gt]: 75,
            },
          },
        },
      ],
    })

    statistics.average_department_rating = await User.findAll({
      attributes: [
        "department_id",
        [
          Sequelize.fn("AVG", Sequelize.col("Reviews.rating")),
          "average_rating",
        ],
      ],
      include: [
        {
          model: Review,
          as: "Reviews",
          attributes: [], // Include only the necessary attributes from the Reviews table
        },
        {
          model: Department,
          as: "Department",
          attributes: ["name"], // Include only the necessary attributes from the Department table
        },
      ],
      group: ["department_id", "Department.id"], // Group by the department_id and Department.id
    })

    // most used skill
    statistics.most_used_skills = await Skill.findAll({
      attributes: [
        "name",
        [
          Sequelize.literal(
            '(SELECT COUNT("UserSkill"."user_id") FROM "UserSkill" WHERE "UserSkill"."skill_id" = "Skill"."id")'
          ),
          "usage_count",
        ],
      ],
      limit: 20,
      order: [[Sequelize.literal("usage_count"), "DESC"]],
    })

    //Average time taken to complete a ticket
    statistics.average_time_taken_to_complete_a_ticket = await Ticket.findAll({
      attributes: [
        [Sequelize.fn("AVG", Sequelize.literal("createdAt - updatedAt"))],
        "avg_time_taken_to_complete",
      ],
    })

    res.status(200).send(statistics)
  } catch (error) {
    console.error("Error in statistics endpoint:", error.message, error)
    res.status(500).send("Internal Server Error")
  }
})

router.get("/property", [auth], async (req, res) => {
  const pn = req.query.propertyName
  const pv = req.query.propertyValue
  console.log(typeof pv)
  if (!isNaN(Number(pv)))
    return res.status(400).send("property value cannot be an integer")
  const Users = await User.findAll({
    attributes: { exclude: ["password"] },
    where: {
      [pn]: {
        [Op.iLike]: `%${pv}%`, // Use Op.iLike for case-insensitive LIKE
      },
    },
  })

  res.status(200).send(Users)
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
        model: Experience,
        as: "Experience",
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
        model: Skill,
        as: "Skill",
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
  if (!user) return res.status(404).send("employyee not found")
  // Calculate total experience using Moment.js
  if (user.Experience && user.Experience.length !== 0) {
    const totalExperienceInSeconds = user.Experience.reduce((total, exp) => {
      const from = moment(exp.from)
      const to = moment(exp.to)
      return total + to.diff(from, "seconds")
    }, 0)

    // Convert total experience to a human-readable format
    const formattedTotalExperience = moment
      .duration(totalExperienceInSeconds, "seconds")
      .humanize()

    // Add totalExperience property to the user object
    user.totalExperience = formattedTotalExperience
  }
  res.status(200).send(user)
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

    const department = await Department.findByPk(req.body.department_id)

    if (!department) return res.status(400).send("department not found...")

    const salt = await bcrypt.genSalt(10)
    const p = await bcrypt.hash(req.body.password, salt)
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: p,
      salary: req.body.salary,
      age: req.body.age,
      isAdmin: req.body.isadmin,
      department_id: req.body.department_id,
      performance_id: req.body.performance_id,
      total_working_days: req.body.total_working_days,
      last_seen: req.body.last_seen,
      attended_meetings: req.body.attended_meetings,
      total_meetings: req.body.total_meetings,
    })

    const token = user.generateAuthToken()

    res.status(201).send({ token: token, User: user })
  } catch (ex) {
    console.log(ex, ex.message)
  }
})

router.put("/:id", auth, async (req, res) => {
  try {
    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    })

    const authenticatedUser = await User.findByPk(req.user.id)

    if (!authenticatedUser) {
      return res.status(404).send("User Not Found.")
    }

    if (userExists) {
      return res.status(400).send("Email already in use.")
    }
    console.log("herererererer", authenticatedUser)
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      authenticatedUser.password
    )

    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials.")
    }

    const updatedUser = await User.update(
      {
        name: req.body.name,
        email: req.body.email,
        salary: req.body.salary,
        age: req.body.age,
        isadmin: req.body.isadmin,
        department_id: req.body.department_id,
        performance_id: req.body.performance_id,
        total_working_days: req.body.total_working_days,
        last_seen: req.body.last_seen,
        attended_meetings: req.body.attended_meetings,
        total_meetings: req.body.total_meetings,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )

    // Consider generating a new authentication token if needed
    const token = authenticatedUser.generateAuthToken()
    console.log(updatedUser, authenticatedUser)
    res.status(200).send({ User: updatedUser, token: token })
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
