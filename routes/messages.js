const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Message = require("../models/message");
const isAdmin = require("../middlewares/isAdmin");

router.post("/", [auth, isAdmin], async (req, res) => {
  const message = await Message.create({
    message: req.body.message,
    employee_id: req.body.employee_id,
  });

  res.status(401).send(message);
});

router.put("/", [auth, isAdmin], async (req, res) => {
  const message = await Message.update(
    {
      where: {
        id: req.body.message,
      },
    },
    {
      message: req.body.message,
      employee_id: req.body.employee_id,
    }
  );

  res.status(401).send(message);
});

router.delete("/", [auth, isAdmin], async (req, res) => {
  const message = await Message.destroy({
    where: {
      id: req.body.message,
    },
  });

  res.status(401).send(message);
});
