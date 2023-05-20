const Sequelize = require('sequelize');
const db = require('../startup/db');
const jwt = require("jsonwebtoken");
const winston = require("winston");
const schedule = require('node-schedule');
const Experience = require('./experience');

const Employee = db.define('Employee', {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: Sequelize.STRING,
  age: Sequelize.INTEGER,
  phone: Sequelize.INTEGER,
  salary: Sequelize.INTEGER,
  isAdmin: Sequelize.BOOLEAN,
  manager_id: Sequelize.INTEGER,
  education_id: Sequelize.INTEGER,
  department_id: Sequelize.INTEGER,
  performance_id: Sequelize.INTEGER,
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
  socket_id: Sequelize.STRING,
  total_meeting: Sequelize.INTEGER,
  attended_meetings: Sequelize.INTEGER
}, {
  indexes: [
    {
      unique: false,
      fields: ['id', 'name', 'age']
    }
  ]
});

Employee.prototype.generateAuthToken = async function () {
  const token = jwt.sign(
    { id: this.getDataValue('id'), isAdmin: this.getDataValue('isAdmin') },
    "karan112010"
  );
  return token;
};

Employee.prototype.countExperience = async function () {
  const experience = await Experience.findAll({
    where: {
      id: this.getDataValue('id')
    },
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('from')), 'start_date'],
      [Sequelize.fn('SUM', Sequelize.col('to')), 'end_date'],
      [Sequelize.literal('start_date - end_date'), 'totalExperience']
    ],
    select: ['start_date', 'end_date', 'totalExperience']
  });
  return experience;
};

Employee.afterCreate(async (employee, options) => {
  console.log('sus');
  try {

    employee.salary = employee.salary_per_hour * employee.total_working_hours * employee.total_working_days;

    // Schedule the job
    const job = schedule.scheduleJob({ day: 1, hour: 0, minute: 0 }, async () => {
      try {
        // Check if it's the first day of the month
        const now = moment();
        if (now.format('D') === '1') {
          // Execute the salary_credited function
          await salary_credited(now.format());
          winston.info('Notification created');
        }
      } catch (error) {
        winston.info('Error creating notification:', error);
      }
    });

    // Function to be executed when salary is credited
    async function salary_credited(date) {
      // Create the notification or perform other actions
      await Notification.create({
        message: 'Salary credited',
        employee_id: employee.id,
        date: date // Pass the formatted date as needed
      });
    }

    winston.info('Job scheduled');
  } catch (error) {
    winston.info('Error in afterCreate hook:', error);
  }
});

Employee.hasMany(Experience, {
  as: "Experience",
  foreignKey: "employee_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

Employee.belongsTo(Employee, {
  as: 'Manager',
  foreignKey: 'manager_id',
  selfGranted: true,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Employee.hasMany(Employee, {
  as: 'Employees',
  foreignKey: 'manager_id',
  selfGranted: true,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});


module.exports = Employee;