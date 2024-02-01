const Sequelize = require("sequelize")
const db = require("../startup/db")

const FollowUser = db.define({
  following_id: Sequelize.INTEGER,
  followedBy_id: Sequelize.INTEGER,
})

FollowUser.belongsTo(User, {
  as: "followedBy",
  foreignKey: "followedBy_id",
  onDelete: "CASCADE",
})

FollowUser.hasOne(User, {
  as: "following",
  foreignKey: "following_id",
  onDelete: "CASCADE",
})

module.exports = FollowUser
