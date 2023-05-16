const Sequelize = require('sequelize');
const db = require('../startup/db');
const moment = require("moment");

const Ticket = db.define('Ticket', {
  name: Sequelize.STRING,
  steps: Sequelize.ARRAY(Sequelize.STRING),
  deadline: Sequelize.DATE
}, {
  timestamps: true
});

const Employee = require('./employee'); // Move the require statement here

Ticket.belongsTo(Employee, {
  as: "Ticket",
  foreignKey: "employee_id",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Employee.hasMany(Ticket, {
  as: "Ticket",
  foreignKey: "employee_id",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Ticket.afterCreate(async (instance) => {
  const deadline = moment(instance.deadline);
  const newDate = deadline.subtract(1, 'days');
  const notificationDD = moment(newDate);
  const NDDY = notificationDD.year();
  const NDDM = notificationDD.month();   const NDDD = notificationDD.date(); 

  schedule.scheduleJob({NDDY,NDDM,NDDD},async () => {
    await Notification.create({
      message: `Ticket pending! complete now!, name  : ${instance.name}`
 });

    const DY = deadline.year();     const DM = deadline.month();
    const DD = deadline.date();
   
    schedule.scheduleJob({DY,DM,DD}, async () => {
      await instance.destroy();

    });
  });
})

const winston = require("winston");

Ticket
  .sync({ force: true })
  .then(() => {
    winston.info('Ticket table created');
  })
  .catch((ex) => {
    winston.error("Error while creating TICKET table", ex);
  });

module.exports = Ticket;