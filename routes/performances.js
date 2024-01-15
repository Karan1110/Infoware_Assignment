const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const isadmin = require("../middlewares/isAdmin.js")
// [auth,isadmin]
const Performance = require("../models/performance.js")
const Employee = require("../models/employee.js")

function generateRandomNumericId(length) {
  const numbers = "0123456789"
  let randomId = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length)
    randomId += numbers.charAt(randomIndex)
  }

  return randomId
}

// Example: Generate a random numeric ID with a length of 8 digits
const randomNumericId = generateRandomNumericId(8)
console.log(randomNumericId)

router.get("/:id", async (req, res) => {
  const performance = await Performance.findByPk(req.params.id)
  if (!performance) return res.status(400).send("not found..")
  res.send(performance)
})
router.post("/", async (req, res) => {
  const employee = await Employee.findByPk(req.body.employee_id)
  if ((employee && employee?.performance_id != null) || undefined) {
    return res
      .status(400)
      .send("Employee's performance record already exists...")
  }

  const performance = await Performance.create({
    id: randomNumericId,
    status: req.body.status,
    points: req.body.points,
  })

  res.status(200).send(performance)
})

router.put("/:id", [auth, isadmin], async (req, res) => {
  const performance = await Performance.update(
    {
      status: req.body.status,
      points: req.body.points,
    },
    {
      where: {
        id: req.body.employee_id,
      },
    }
  )
  res.status(200).send(performance)
})

module.exports = router
