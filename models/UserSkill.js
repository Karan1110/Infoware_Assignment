const db = require("../startup/db")
const Sequelize = require("sequelize")

const UserSkill = db.define(
  "UserSkill",
  {
    user_id: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
    skill_id: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "UserSkill",
  }
)

module.exports = UserSkill
