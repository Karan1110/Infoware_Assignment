const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const isadmin = require("../middlewares/isAdmin.js")
// [auth,isadmin]
const Education = require("../models/education.js")

router.post("/", async (req, res) => {
  const education = await Education.create({
    field: req.body.field,
    type: req.body.type,
    employee_id: req.body.employee_id,
  })

  res.status(200).send(education)
})

router.put("/:id", [auth], async (req, res) => {
  try {
    const education = await Education.update(
      {
        field: req.body.field,
        type: req.body.type,
        employee_id: req.body.employee_id,
      },
      {
        where: {
          id: req.params.id, // Assuming the education record id is passed in the URL params
        },
      }
    )

    // Check if any records were updated
    if (education[0] === 1) {
      res.status(200).send("Education record updated successfully")
    } else {
      res.status(404).send("Education record not found")
    }
  } catch (error) {
    console.error("Error updating education record:", error.message)
    res.status(500).send("Internal Server Error")
  }
})

router.delete("/:id", auth, async (req, res) => {
  try {
    await Education.destroy({
      where: {
        id: req.params.id,
      },
    })
    res.send("deleted...")
  } catch (ex) {
    console.log(ex)
    res.send(ex.message)
  }
})

module.exports = router
