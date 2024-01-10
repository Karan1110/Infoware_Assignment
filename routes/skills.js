const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const isadmin = require("../middlewares/isAdmin.js")
const Employee = require("../models/employee")
const Skill = require("../models/skills")
const EmployeeSkill = require("../models/intermediate models/EmployeeSkill")

router.post("/", [auth, isadmin], async (req, res) => {
  const { skill_id, employee_id } = req.body

  let skill
  console.log(skill_id, employee_id)
  if (!skill_id) {
    console.log("creating skill...")
    skill = await Skill.create({
      name: req.body.name,
      level: req.body.level,
    })
  } else {
    skill = await Skill.findByPk(skill_id)
  }

  const employee = await Employee.findByPk(employee_id)
  if (!employee) return res.status(400).send("User not found")
  console.log(employee, skill)
  await EmployeeSkill.create({
    employee_id: employee.dataValues.id || employee.id,
    skill_id: skill.dataValues.id || skill.id,
  })

  res.status(200).send(skill)
})

router.put("/:id", [auth, isadmin], async (req, res) => {
  const skill = Skill.update(
    {
      name: req.body.name,
      level: req.body.level,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )

  res.status(200).send(skill)
})

router.delete("/:id", [auth, isadmin], async (req, res) => {
  await Skill.destroy({
    where: {
      id: req.params.id,
    },
  })

  res.status(200).send("Deleted successfully")
})

module.exports = router
