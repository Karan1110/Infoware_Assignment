const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const isadmin = require("../middlewares/isAdmin.js")
const User = require("../models/user")
const Skill = require("../models/skills")
const UserSkill = require("../models/UserSkill")
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
router.post("/", async (req, res) => {
  const skill = await Skill.create({
    name: req.body.name,
    level: req.body.level,
  })
  res.json(skill)
})

router.post("/add", [auth, isadmin], async (req, res) => {
  const { skill_id, user_id } = req.body

  const user = await User.findByPk(user_id)
  if (!user) return res.status(400).send("User not found")

  const skill = await Skill.findByPk(skill_id)

  await UserSkill.create({
    user_id: user.dataValues.id || user.id,
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
