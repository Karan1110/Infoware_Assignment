const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const isadmin = require("../middlewares/isAdmin.js")
const Employee = require("../models/employee")
const Ticket = require("../models/ticket")
const moment = require("moment")
const { Op } = require("sequelize")

router.get("/latest", async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      order: [["createdAt", "DESC"]],
    })
    res.json(tickets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/name", async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      order: [["name", "ASC"]],
    })
    res.json(tickets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/incomplete", async (req, res) => {
  try {
    const incompleteTickets = await Ticket.findAll({
      where: { completed: false },
    })
    res.json(incompleteTickets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/completed", async (req, res) => {
  try {
    const completedTickets = await Ticket.findAll({
      where: { completed: true },
    })
    res.json(completedTickets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/search", async (req, res) => {
  try {
    const { ticket_name } = req.body

    if (!ticket_name) {
      return res
        .status(400)
        .json({ error: "Ticket name is required in the request body." })
    }

    const matchingTickets = await Ticket.findAll({
      where: {
        name: {
          [Op.like]: `%${ticket_name}%`, // Using Sequelize's Op.like for a partial match
        },
      },
    })

    res.json(matchingTickets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.post("/", [auth, isadmin], async (req, res) => {
  const employee = await Employee.findByPk(req.body.employee_id)

  if (!employee) return res.status(400).send("user not found")

  // if (employee.manager_id !== req.user.id)
  //   return res.status(400).send("Not authorized")

  const start_date = moment(req.body.deadline).format(
    "YYYY-MM-DDTHH:mm:ss.SSSZ"
  )

  const s = new Date(start_date)

  const ticket = await Ticket.create({
    name: req.body.name,
    steps: req.body.steps,
    employee_id: req.body.employee_id,
    deadline: s,
  })

  const d = new Date(
    ticket.dataValues.deadline.getUTCFullYear(),
    ticket.dataValues.deadline.getUTCMonth(),
    ticket.dataValues.deadline.getUTCDate(),
    ticket.dataValues.deadline.getUTCHours(),
    ticket.dataValues.deadline.getUTCMinutes(),
    ticket.dataValues.deadline.getUTCSeconds()
  )

  const time_out = s.getTime() - Date.now()

  setTimeout(async () => {
    console.log("Event firing...")
    await ticket.destroy()
  }, time_out)

  const time_out_ii = s
  time_out_ii.setDate(s.getDate() - 1)
  console.log(time_out_ii)
  const real_timeout = time_out_ii.getTime() - Date.now()

  setTimeout(async () => {
    await Notification.create({
      message: `Ticket pending! complete now! ${ticket.name}`,
      employee_id: ticket.employee_id,
    })
  }, real_timeout)

  res.status(200).send(ticket)
})

router.put("/:id", [auth, isadmin], async (req, res) => {
  const ticket = await Ticket.update(
    {
      name: req.body.name,
      steps: req.body.steps,
      employee_id: req.body.employee_id,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )

  res.status(200).send(ticket)
})

router.delete("/:id", [auth, isadmin], async (req, res) => {
  await Ticket.destroy({
    where: {
      id: req.params.id,
    },
  })

  res.status(200).send("Deleted successfully")
})

module.exports = router
