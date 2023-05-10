const Sequelize = require('sequelize');
const db = require('../startup/db');
const jwt = require("jsonwebtoken");
const config = require("config");
const schedule = require('node-schedule');

const Employee = db.define('Employee', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  age: Sequelize.INTEGER,
  phone: Sequelize.STRING,
  salary: Sequelize.INTEGER,
  isAdmin: Sequelize.BOOLEAN,
  total_working_hours: {
    type : Sequelize.INTEGER,
    allowNull : true,
    default : 8
  },
  total_working_days: {
    type: Sequelize.INTEGER,
    allowNull : true,
    default : 25
  },
  salary_per_hour: {
    type: Sequelize.INTEGER,
    allowNull : true,
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

Employee.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this.id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

Employee.belongsTo(Employee, {
  as: "EmployeeManager",
  foreignKey: "manager_id",
  selfGranted: true,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Employee.afterCreate((instance,options) => {
  const job = schedule.scheduleJob('0 12 1 * *', async () => {
    try {
      instance.salary = instance.salary_per_hour * instance.total_working_hours * instance.total_working_days;
      instance.total_working_days = null // set it to default
      instance.total_working_hours = null // set it to default
      instance.salary_per_hour = null // set it to default
      Notification.create({
        message: "salary credited",
        employee_id: instance.id
      })
        .then(() => {
          console.log("sus")
        })
        .catch((ex) => {
          console.log("Error :",ex)
         });
    }
    catch (ex) {
     await  job.cancel();
   }
  });
})


Employee.sync().then(() => {
  const winston = require("winston")
winston.info('Employee table created');
});

module.exports = Employee;