const Sequelize = require('sequelize');
const db = require('../startup/db');
const jwt = require("jsonwebtoken");
const config = require("config");
const schedule = require('node-schedule');

const Employee = db.define('Employee', {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: Sequelize.STRING,
  age: Sequelize.INTEGER,
  phone: Sequelize.STRING,
  salary: Sequelize.INTEGER,
  isAdmin: Sequelize.BOOLEAN,
  manager_id: Sequelize.INTEGER,
  education_id: Sequelize.INTEGER,
  department_id: Sequelize.INTEGER,
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
  }
}, {
  indexes: [
    {
      unique: false,
      fields: ['id', 'name', 'age']
    }
  ],
  tableName: 'employees' // Specify the custom table name here
});

let job;

// Employee.afterCreate(async (employee, options) => {
//   winston.info('sus');
//   try {
//     // Reload the employee to get the latest values from the database
//     await employee.reload();

//     // Set the attributes to their default values
//     employee.total_working_days = 25;
//     employee.total_working_hours = 8;
//     employee.salary_per_hour = 99;

//     // Calculate the salary
//     employee.salary = employee.salary_per_hour * employee.total_working_hours * employee.total_working_days;

//     // Schedule the job
//      job = schedule.scheduleJob({ day: 1, hour: 0, minute: 0 }, async () => {
//       // try {
//       //   // Create the notification or perform other actions
//       //   await Notification.create({
//       //     message: 'Salary credited',
//       //     employee_id: employee.id
//       //   });
//       //   winston.info('Notification created');
//       // } catch (error) {
//       //   winston.info('Error creating notification:', error);
//       // }
//     });

//     winston.info('Job scheduled');
//   } catch (error) {
//     winston.info('Error in afterCreate hook:', error);
//   }
// });

Employee.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this.id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

Employee.belongsTo(Employee, {
  as: 'Manager',
  foreignKey: 'manager_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

const winston = require("winston");

Employee
  .sync({ force: true })
  .then(() => {
    winston.info('Employee table created');
  })
  .catch((ex) => {
    winston.error("Employee table NOT created", ex)
  });
module.exports = Employee;