const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isadmin = require("../middlewares/isadmin");
// [auth,isadmin]
const Education = require("../models/education.js");

router.post("/", async (req, res) => {
  const Education = await Education.create({
    field: req.body.field,
    type: req.body.type,
    employee_id: req.body.employee_id,
  });

  res.status(200).send(Education);
});

router.put("/:id", [auth, isadmin], async (req, res) => {
  const Education = await Education.create(
    {
      where: {
        id: req.body.employee_id,
      },
    },
    {
      field: req.body.field,
      type: req.body.type,
      employee_id: req.body.employee_id,
    }
  );
  res.status(200).send(Education);
});

module.exports = router;
