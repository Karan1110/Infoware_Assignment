const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const Notification = require("../models/notifications");
// [auth,isAdmin]
router.post("/", async (req, res) => {
  const notification = await Notification.create({
    message: req.body.message,
    employee_id: req.body.employee_id,
  });

  res.status(200).send(notification);
});

router.put("/:id", [auth, isAdmin], async (req, res) => {
  const notification = await Notification.update(
    {
      where: {
        id: req.params.id,
      },
    },
    {
      message: req.body.message,
      employee_id: req.body.employee_id,
    }
  );

  res.status(200).send(notification);
});

router.delete("/:id", [auth, isAdmin], async (req, res) => {
  const notification = await Notification.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).send({ DELETED: notification });
});

module.exports = router;
