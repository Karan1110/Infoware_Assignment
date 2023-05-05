const Sequelize = require('sequelize');
const db = require('../config/database');
const jwt = require("jsonwebtoken");

const Employee = db.define('Employee', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  age: Sequelize.INTEGER,
  phone: Sequelize.STRING,
  salary: Sequelize.INTEGER,
  isAdmin: Sequelize.BOOLEAN,
  total_working_hours: Sequelize.DATE,
  working_hours_per_day : Sequelize.DATE,
  working_hours: Sequelize.DATE,
  total_leaves: Sequelize.DATE,
  leaves_token : Sequelize.DATE
},{
  indexes: [
    {
      unique: true,
      fields: ['id','name', 'age']
    }
  ]
});

Employee.prototype.generateAuthToken = function() {
  const token = jwt.sign(
    { id: this.id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

Employee.hasMany(Employee, { as: "Employee", forgeinKey: "employee_id" });

Employee.belongsTo(Employee, {
  as: "Manager",
  forgeinKey: "manager_id",
  selfGranted : true
});

Employee.sync().then(() => {
  winston.info('Employee table created');
});

module.exports = Employee;