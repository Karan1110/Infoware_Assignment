const Sequelize = require("sequelize")
const db = require("../startup/db")
const jwt = require("jsonwebtoken")
const Experience = require("./experience")
const Notification = require("./notifications")
const Performance = require("./performance")

const Employee = db.define(
  "Employee",
  {
    name: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: Sequelize.STRING,
    age: Sequelize.INTEGER,
    salary: Sequelize.INTEGER,
    isAdmin: Sequelize.BOOLEAN,
    manager_id: Sequelize.INTEGER,
    education_id: Sequelize.INTEGER,
    department_id: Sequelize.INTEGER,
    performance_id: {
      type: Sequelize.INTEGER,
    },
    total_working_hours: {
      type: Sequelize.INTEGER,
      defaultValue: 8,
      // allowNull : false
    },
    total_working_days: {
      type: Sequelize.INTEGER,
      defaultValue: 25,
      // allowNull : false
    },
    salary_per_hour: {
      type: Sequelize.INTEGER,
      defaultValue: 99,
      // allowNull : false
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
    last_seen: Sequelize.DATE,
    isOnline: Sequelize.BOOLEAN,
    punctuality_score: {
      type: Sequelize.VIRTUAL,
      get() {
        const temp =
          (100 / this.getDataValue("total_meetings")) *
          this.getDataValue("attended_meetings")
        if (Math.round(temp) > 75) {
          return "Probably will attend meetings"
        } else if (Math.round(temp) < 75) {
          return "May or may not attend"
        } else if (Math.round(temp) < 25) {
          return "Probably will not attend"
        }
      },
    },
  },
  {
    timestamps: true,
  }
)
Employee.belongsTo(Performance, {
  as: "Performance",
  foreignKey: "performance_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Employee.hasMany(Experience, {
  as: "Experience",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})
Experience.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Employee.belongsTo(Employee, {
  as: "Manager",
  foreignKey: "manager_id",
  selfGranted: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Employee.hasMany(Notification, {
  as: "Notification",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

// Employee.hasMany(Employee, {
//   as: "Employees",
//   foreignKey: "manager_id",
//   selfGranted: true,
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// })

Employee.prototype.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this.getDataValue("id"), isadmin: this.getDataValue("isadmin") },
    "karan112010"
  )
  return token
}

Employee.countExperience = async function () {
  const experience = await Experience.findAll({
    attributes: [[Sequelize.literal('("to" - "from")'), "duration"]],
    order: [[Sequelize.literal("duration"), "DESC"]],
    limit: 10,
    include: [
      {
        model: Employee,
        as: "Employee",
      },
    ],
  })

  return experience
}

module.exports = Employee
