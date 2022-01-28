'use strict';
const { uuid } = require('uuidv4');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ResetPasswords', {
      id: {
        type: Sequelize.UUID,
        defaultValue: uuid(),
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
