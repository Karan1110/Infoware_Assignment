const Sequelize = require('sequelize');
const db = require('../startup/db');
const Department = require('./department');

const Position = db.define('Position', {
  name: Sequelize.STRING
}, {
  indexes: [
    {
      fields: ['name']
    }
  ]
});

Position.belongsTo(Department, {
  as: 'DepartmentPosition',
  foreignKey: 'department_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Department.hasMany(Position);

Position.sync().then(() => {
  const winston = require('winston');
  winston.info('Position table created');
});

module.exports = Position;
