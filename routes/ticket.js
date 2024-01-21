const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const isadmin = require("../middlewares/isAdmin.js")
const Employee = require("../models/employee")
const Performance = require("../models/performance.js")
const Ticket = require("../models/ticket")
const moment = require("moment")
const { Op } = require("sequelize")
const admin = require("firebase-admin")
const path = require("path")
const multer = require("multer")
const serviceAccount = require(path.join(
  __dirname,
  "../karanstore-2c850-firebase-adminsdk-5ry9v-ff376d22e0.json"
))
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "karanstore-2c850.appspot.com",
})

const bucket = admin.storage().bucket()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// count
router.get("/", async (req, res) => {
  try {
    const tickets = []
    const open = await Ticket.count({
      where: {
        status: "open",
      },
    })
    const closed = await Ticket.count({
      where: {
        status: "closed",
      },
    })
    const inProgress = await Ticket.count({
      where: {
        status: "in-progress",
      },
    })
    tickets.push(open)
    tickets.push(closed)
    tickets.push(inProgress)

    res.send(tickets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/closed", async (req, res) => {
  try {
    const incompleteTickets = await Ticket.findAll({
      where: { status: "closed" },
      order: [
        [
          `${req.query.sortingProperty}`,
          `${req.query.sortingProperty == "createdAt" ? "DESC" : "ASC"}`,
        ],
      ],
    })
    res.json(incompleteTickets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})
// filter open tickets
router.get("/open", async (req, res) => {
  try {
    const openTickets = await Ticket.findAll({
      where: { status: "open" },
      order: [
        [
          `${req.query.sortingProperty}`,
          `${req.query.sortingProperty == "createdAt" ? "DESC" : "ASC"}`,
        ],
      ],
    })
    res.json(openTickets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})
// filter in-progress tickets
router.get("/in-progress", async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { status: "in-progress" },

      order: [
        [
          `${req.query.sortingProperty}`,
          `${req.query.sortingProperty == "createdAt" ? "DESC" : "ASC"}`,
        ],
      ],
    })
    res.json(tickets)
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

router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: {
        model: Employee,
        as: "Employee", // Change " Employee" to "employee"
      },
    })

    res.json(ticket)
  } catch (ex) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.post("/", [auth, upload.single("video")], async (req, res) => {
  console.log(req.user.id, req.body.employee_id)
  const employee = await Employee.findByPk(req.body.employee_id)
  console.log(employee)
  if (!employee) return res.status(400).send("User not found")

  const start_date = moment(req.body.deadline)
  const now = moment()

  // Check if the deadline is more than two days later
  if (start_date.diff(now, "days") <= 1) {
    return res.status(400).send("Deadline should be at least two days later")
  }

  const ticket = await Ticket.create({
    name: req.body.name,
    steps: JSON.parse(req.body.steps),
    employee_id: req.body.employee_id,
    deadline: start_date.toDate(),
    status: req.body.status,
    body: req.body.body,
  })

  const videoBuffer = req.file.buffer
  const videoFileName = `video_${ticket.id}.mp4`
  const videoFilePath = `temp/${videoFileName}` // Temporary local file path

  // Save the video to a temporary file
  await bucket.file(videoFilePath).save(videoBuffer)

  // Transcode video to 720p
  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(bucket.file(videoFilePath).createReadStream())
      .outputFormat("mp4")
      .size("1280x720")
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .saveToFile(videoFilePath)
  })

  // Upload transcoded video to Firebase Storage
  const transcodedVideoPath = `trace/${videoFileName}`
  await bucket.upload(videoFilePath, {
    destination: transcodedVideoPath,
  })

  // Update ticket with signed URL
  const signedUrl = await bucket.file(transcodedVideoPath).getSignedUrl({
    action: "read",
    expires: "03-09-2491", // Replace with a far future date
  })

  await ticket.update({
    videoUrl: signedUrl[0],
  })

  res.status(200).send(ticket)
})

router.put("/assign/:id", [auth], async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id)
  if (!ticket) return res.status(404).json({ message: "ticket not found..." })

  const employee = await Employee.findByPk(req.body.employee_id)
  if (!employee)
    return res.status(404).json({ message: "employee not found..." })

  await Ticket.update(
    {
      employee_id: req.body.employee_id,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )

  res.status(200).json({ message: "done!" })
})

router.put("/:id", [auth, isadmin], async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id)
  if (!ticket) return res.status(404).json({ message: "ticket not found..." })

  const deadline = moment(req.body.deadline)

  await Ticket.update(
    {
      name: req.body.name,
      steps: req.body.steps,
      deadline: deadline.toDate(),
      status: req.body.status,
      body: req.body.body,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
  const employee = await Employee.findByPk(ticket.employee_id)
  if (!employee)
    return res.status(404).json({ message: "employee not found..." })

  const performance = await Performance.findOne({
    where: {
      id: employee.performance_id,
    },
  })

  if (performance) {
    // Assuming you want to increment by 1, you can change the value as needed
    await performance.increment({ points: 5 })
  }
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
