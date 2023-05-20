const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");

const Education = db.define("Education", {
  field: Sequelize.STRING,
  type: {
    type: Sequelize.ENUM('Bachelors', 'Masters', 'Phd'),
    allowNull: false
  }
});

Employee.belongsTo(Education, {
  as: "Education",
  foreignKey: "education_id",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

module.exports = Education;