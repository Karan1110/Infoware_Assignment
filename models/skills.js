const Sequelize = require("sequelize")
const db = require("../startup/db")
const UserSkill = require("./UserSkill")
const User = require("./user")

const Skill = db.define(
  "Skill",
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
    level: Sequelize.STRING,
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
    ],
  }
)

Skill.hasMany(UserSkill, { foreignKey: "skill_id" })
User.hasMany(UserSkill, { foreignKey: "user_id" })

User.belongsToMany(Skill, {
  through: UserSkill,
  foreignKey: "user_id",
  as: "Skill",
})

Skill.belongsToMany(User, {
  through: UserSkill,
  foreignKey: "skill_id",
  as: "User",
})

module.exports = Skill
