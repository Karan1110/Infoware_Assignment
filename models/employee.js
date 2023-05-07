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
  total_working_hours: {
    type : Sequelize.DATE,
    default : 8
  },
  total_working_days: {
    type: Sequelize.DATE,
    default : 25
  },
  salary_per_work: {
    type: Sequelize.DATE,
    default : 99
  }
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
    instance.salary = instance.salary_per_hour * instance.total_working_hours * instance.total_working_days;
    instance.total_working_days = null // set it to default
    instance.total_working_hours = null // set it to default
    instance.salary_per_hour = null // set it to default
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