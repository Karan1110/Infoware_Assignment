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
  const notificationDD = moment(newDate);
  const NDDY = notificationDD.year();
  const NDDM = notificationDD.month();
  const NDDD = notificationDD.date(); 

  schedule.scheduleJob({NDDY,NDDM,NDDD},async () => {
    await Notification.create({
      message: `Ticket pending! complete now!, name  : ${instance.name}`
    });

    const DY = deadline.year();
    const DM = deadline.month();
    const DD = deadline.date();
    
    schedule.scheduleJob({DY,DM,DD}, async () => {
      await instance.destroy();

    });
  });
})

Employee.hasMany(Ticket, {
  as: "TicketEmployee",
  foreignKey: "employee_id",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Ticket.sync({force:true}).then(() => {
  const winston = require("winston")
winston.info('Ticket table created');
});

module.exports = Ticket;