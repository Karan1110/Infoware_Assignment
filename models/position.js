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

Position.hasMany(Department, {
  as: 'DepartmentPosition',
  foreignKey: 'department_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Department.belongsTo(Position, {
  as: 'DepartmentPosition',
  foreignKey: 'department_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

const winston = require('winston');

Position.sync({force:true}).then(() => {
  winston.info('Position table created');
});

module.exports = Position;
