'use strict';
const { v4 } = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ResetPasswords', {
      id: {
        type: Sequelize.UUID,
        defaultValue: v4(),
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"Users",
          key:"id"
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
            }
          });
        },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ResetPasswords');
  }
};
