const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
// [auth,isAdmin]
const Performance = require("../models/performance.js");

router.post("/", async (req, res) => {
  const performance = await Performance.create({
    status: req.body.status,
    employee_id: req.body.employee_id,
  });

  res.status(200).send(performance);
});

router.put("/:id", [auth, isAdmin], async (req, res) => {
  const performance = await Performance.create(
    {
      where: {
        id: req.body.employee_id,
      },
    },
    {
      status: req.body.status,
      employee_id: req.body.employee_id,
    }
  );
  res.status(200).send(performance);
});

module.exports = router;
