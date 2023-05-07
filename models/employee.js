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
  total_working_days: Sequelize.DATE,
  salary_per_work : Sequelize.INTEGER
},{
  indexes: [
    {
      unique: false,
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

Employee.afterCreate((instance,options) => {
  schedule.scheduleJob('0 12 1 * *', function() {
    instance.salary = instance.salary_per_hour * total_working_hours * total_working_days;
    Notification.create({
      message: "salary credited",
      employee_id: instance.id
    });
  });
})


Employee.sync().then(() => {
  winston.info('Employee table created');
});

module.exports = Employee;