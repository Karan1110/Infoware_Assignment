const express = require("express");
const router = express.Router();
const app = express();
const auth = require("../middlewares/auth");
const Message = require("../models/message");
const isadmin = require("../middlewares/isadmin");

router.post("/", [auth, isadmin], async (req, res) => {
  const message = await Message.create({
    message: req.body.message,
    employee_id: req.body.employee_id,
  });

  res.status(401).send(message);
});

router.put("/:id", [auth, isadmin], async (req, res) => {
  await Message.update(
    {
      message: req.body.message,
      employee_id: req.body.employee_id,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );

  const message = await Message.findOne({
    where: {
      id: req.params.id,
    },
  });

  app.ws(`chat/${message.dataValues.chatRoom_id}`, (req, ws) => {
    ws.send(JSON.stringify(message));
  });

  res.status(401).send(message);
});

router.delete("/", [auth, isadmin], async (req, res) => {
  const message = await Message.destroy({
    where: {
      id: req.body.message,
    },
  });

  res.status(401).send(message);
});

module.exports = router;
