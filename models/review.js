// review.js

const Sequelize = require("sequelize")
const db = require("../startup/db")
const Employee = require("./employee") // Import the Employee model

const Review = db.define(
  "Review",
  {
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
    rating: Sequelize.INTEGER,
  },
  {
    timestamps: true,
  }
)

// Establishing the association
Review.belongsTo(Employee, {
  as: "Employee", // Alias for the association
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

Employee.hasMany(Review, {
  as: "Reviews",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

module.exports = Review
