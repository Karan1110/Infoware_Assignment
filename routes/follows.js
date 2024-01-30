const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth.js")
const User = require("../models/user.js")

router.post("/follow/:id", [auth], async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: "user not found..." })

    const followedUser = await User.findByPk(req.params.id)

    if (!followedUser) return res.status(404).send("user not found....")

    await user.update({
      followedUsers: [
        ...user.dataValues.followedUsers,
        followedUser.dataValues.id,
      ],
    })

    res.status(200).send("done!")
  } catch (error) {
    console.error("Error in follow user endpoint:", error.message, error)
    res.status(500).send("Internal Server Error")
  }
})

router.post("/unfollow/:id", [auth], async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: "user not found..." })

    const followedUser = await User.findByPk(req.params.id)
    const new_followed_list = user.dataValues.followedUsers.filter((id) => {
      return id !== req.params.id
    })

    if (!followedUser) return res.status(404).send("user not found....")

    await user.update({
      followedUsers: new_followed_list,
    })

    res.status(200).send("done!")
  } catch (error) {
    console.error("Error in follow user endpoint:", error.message, error)
    res.status(500).send("Internal Server Error")
  }
})

module.exports = router
