const Sequelize = require("sequelize")
const db = require("../startup/db")
const jwt = require("jsonwebtoken")
const Notification = require("./notification")
const Performance = require("./performance")

const User = db.define(
  "User",
  {
    name: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: Sequelize.STRING,
    department_id: Sequelize.INTEGER,
    performance_id: {
      type: Sequelize.INTEGER,
    },
    total_meetings: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    attended_meetings: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    chats: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
    },
    blockedUsers: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: [],
    },
    followedUsers: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: [],
    },
    last_seen: Sequelize.DATE,
    isOnline: Sequelize.BOOLEAN,
    punctuality_score: {
      type: Sequelize.VIRTUAL,
      get() {
        const temp =
          (this.getDataValue("attended_meetings") /
            this.getDataValue("total_meetings")) *
          100

        if (Math.round(temp) > 75) {
          return `Probably will attend meetings - ${temp}%`
        } else if (Math.round(temp) < 75) {
          return `May or may not attend - ${temp}%`
        } else if (Math.round(temp) < 25) {
          return `Probably will not attend - ${temp}%`
        }
      },
    },
  },
  {
    timestamps: true,
  }
)

User.belongsTo(Performance, {
  as: "Performance",
  foreignKey: "performance_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Performance.hasOne(User, {
  as: "User",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

User.hasMany(Notification, {
  as: "Notification",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

User.prototype.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this.getDataValue("id"), isadmin: this.getDataValue("isadmin") },
    "karan112010"
  )
  return token
}

module.exports = User
