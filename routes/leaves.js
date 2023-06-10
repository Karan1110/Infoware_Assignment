const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Employee = require("../models/employee");
const isadmin = require("../middlewares/isadmin");
const Sequelize = require("sequelize");

router.post("/leaves", [auth, isadmin], async (req, res) => {
  const employee = await Employee.update(
    {
      total_leaves: Sequelize.literal("total_leaves + 1"),
      total_working_days: Sequelize.literal("total_working_days - 1"),
    },
    { where: { id: 1 } }
  );

  res.status(401).send(employee);
});

router.post("/leaves", [auth, isadmin], async (req, res) => {
  const employee = await Employee.update(
    {
      total_leaves: Sequelize.literal("total_working_hours + 1"),
    },
    { where: { id: 1 } }
  );

  res.status(401).send(employee);
});

module.exports = router;
