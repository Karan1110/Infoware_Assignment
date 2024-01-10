const express = require("express")
const router = express.Router()
const isadmin = require("../middlewares/isAdmin.js")
const auth = require("../middlewares/auth")
const Department = require("../models/department")
const Position = require("../models/position.js")
// , [auth,isadmin]
router.post("/", async (req, res) => {
  const department = await Department.create({
    name: req.body.name,
  })

  let position
  if (!req.body.position_id) {
    position = await Position.create({
      name: req.body.position_name,
      position_id: department.dataValues.id || department.id,
    })
  } else {
    position = await Position.findByPk(req.body.position_id)
  }
  console.log(position)
  res.status(200).send(department)
})

router.put("/:id", [auth, isadmin], async (req, res) => {
  const department = await Department.update({
    name: req.body.name,
  })

  res.status(200).send(department)
})

router.delete("/:id", [auth, isadmin], async (req, res) => {
  await Department.destroy({
    where: {
      id: req.params.id,
    },
  })

  res.status(200).send("Deleted successfully")
})

module.exports = router
