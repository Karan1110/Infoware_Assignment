const Sequelize = require('sequelize');
const db = require('../startup/db');
const department = require('./department');

const Position = db.define('Position', {
  name  : Sequelize.STRING
}, {
    indexes : ["name"]
});

Position.hasOne(department, {
  as: "Department",
  foreignKey  :"department_key"
});

Position.belongsTo(department,{as : "Position",through : "department_id",onDelete: 'CASCADE',onUpdate: 'CASCADE'});

Position.sync().then(() => {
  const winston = require("winston")
winston.info('Position table created');
});

module.exports = Position;
