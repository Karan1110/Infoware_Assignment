const Sequelize = require("sequelize");
const Employee = require("./employee");
const db = require("../startup/db");

const Education = db.define("Education", {
  name: Sequelize.STRING,
  type: Sequelize.STRING,
});


Education.hasMany(Employee, {
  as: "EmployeeEducation",
  foreignKey: "education_id",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Employee.belongsTo(Education, {
  as: "Education",
  foreignKey: "education_id",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

const winston = require("winston");

Education
  .sync({ force: true })
  .then(() => {
    winston.info("Education table created...")
  })
  .catch((ex) => {
    winston.info("Education table Error... ", ex); 
  });

module.exports = Education;
