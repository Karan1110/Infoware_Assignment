const Sequelize = require('sequelize');
const db = require('../startup/db');
const Employee = require('./employee');
const moment = require("moment");

const Ticket = db.define('Ticket', {
    name: Sequelize.STRING,
    steps: Sequelize.ARRAY(Sequelize.STRING),
    deadline : Sequelize.DATE
},{
  timestamps: true 
});

Ticket.afterCreate(async (instance) => {
  const deadline = moment(instance.deadline);
  const newDate = deadline.subtract(1, 'days');

  schedule.scheduleJob(newDate, () => {
    Notification.create({
      message: `Ticket pending! complete now!, name  : ${instance.name}`
    });
    
    schedule.scheduleJob(instance.deadline, () => {
      instance.destroy();
    });
    
  });
})

Ticket.hasOne(Employee, { as: " Employee", foreignKey: "employee_id" });
Ticket.belongsTo(Employee, { through: "employee_id" });

Ticket.sync().then(() => {
  const winston = require("winston")
winston.info('Ticket table created');
});

module.exports = Ticket;