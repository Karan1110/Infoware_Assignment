const Chat = require("../models/chatRoom")
const router = require("express").Router()

router.get("/:id", async (req, res) => {
  const chatRoom = await Chat.findByPk(req.params.id)
  res.send(chatRoom)
})

module.exports = router
