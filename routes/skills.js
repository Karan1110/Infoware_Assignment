const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const isadmin = require("../middlewares/isAdmin.js")
const Employee = require("../models/employee")
const Skill = require("../models/skills")
const EmployeeSkill = require("../models/intermediate models/EmployeeSkill")
const Sequelize = require("sequelize")

router.get("/", auth, async (req, res) => {
  const skills = await Skills.findAll({
    where: {
      name: {
        [Sequelize.Op.like]: `%${req.query.skill}%`, // Using Sequelize's Op.like for a partial match
      },
    },
  })
  res.json(skills)
})
// auth,
router.post("/",  async (req, res) => {
  const skill = await Skill.create({
    name: req.body.name,
    level: req.body.level,
  })
  res.json(skill)
})

router.post("/add", [auth, isadmin], async (req, res) => {
  const { skill_id, employee_id } = req.body

  const employee = await Employee.findByPk(employee_id)
  if (!employee) return res.status(400).send("User not found")

  const skill = await Skill.findByPk(skill_id)

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
