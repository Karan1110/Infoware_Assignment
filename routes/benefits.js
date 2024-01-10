const express = require("express")
const router = express.Router()
const winston = require("winston")
const auth = require("../middlewares/auth")
const moment = require("moment")
const isadmin = require("../middlewares/isAdmin.js")
const Employee = require("../models/employee")
const Benefit = require("../models/benefits")
const Benefit_type = require("../models/benefit_type")
// [auth,isadmin]
router.post("/", async (req, res) => {
  const from = moment()
  from.format("YYYY-MM-DDTHH:MM:SS.000Z")
  const to = moment(req.body.to)

  const { benefit_type_id } = req.body
  let benefit_type
  let benefit

  if (!benefit_type_id) {
    benefit_type = await Benefit_type.create({
      name: "medical",
    })

    winston.info(
      benefit_type,
      `this is beenfit type id ${benefit_type.dataValues.id}`
    )

    benefit = await Benefit.create({
      name: req.body.name,
      from: from,
      to: to.format("YYYY-MM-DDTHH:MM:SS.000Z"),
      benefit_type_id: benefit_type.dataValues.id,
      employee_id: req.body.employee_id,
    })
  } else {
    benefit_type = await Benefit_type.findByPk(req.body.benefit_type_id)
    benefit = await Benefit.create({
      name: req.body.name,
      from: from,
      to: from.format("YYYY-MM-DDTHH:MM:SS.000Z"),
      benefit_type_id: benefit_type.dataValues.id,
      employee_id: req.body.employee_id,
    })
  }

  res.status(200).send(benefit)
})

router.put("/:id", [auth, isadmin], async (req, res) => {
  const from = moment()
  from.format("YYYY-MM-DDTHH:MM:SS.000Z")
  const to = moment(req.body.to)

  const { benefit_type_id } = req.body
  let benefit_type
  let benefit

  if (!benefit_type_id) {
    benefit_type = await Benefit_type.create({
      name: req.body.benefit_type_name,
    })

    benefit = await Benefit.update(
      {
        name: req.body.name,
        from: from,
        to: to.format("YYYY-MM-DDTHH:MM:SS.000Z"),
        benefit_type_id: benefit_type.dataValues.id,
        employee_id: req.body.employee_id,
      },
      {
        where: {
          id: req.body.benefit_id,
        },
      }
    )
  } else {
    benefit_type = await Benefit_type.findByPk(req.body.benefit_type_id)
    benefit = await Benefit.update(
      {
        name: req.body.name,
        from: from,
        to: to.format("YYYY-MM-DDTHH:MM:SS.000Z"),
        benefit_type_id: benefit_type.dataValues.id,
        employee_id: req.body.employee_id,
      },
      {
        where: {
          id: req.body.benefit_id,
        },
      }
    )
  }

  res.status(200).send(benefit)
})

router.delete("/:id", [auth, isadmin], async (req, res) => {
  await Benefit.destroy({
    where: {
      id: req.params.id,
    },
  })

  res.status(200).send("Deleted successfully")
})

module.exports = router
