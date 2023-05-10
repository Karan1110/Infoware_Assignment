'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Employees', 'manager_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Employees',
        key: 'id'
      },
      as : 'EmployeeManager',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Employees', 'manager_id');
  }
};
