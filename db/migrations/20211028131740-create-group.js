'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      admin_id:{
        type: Sequelize.INTEGER,
        references:{
          model:"Users"
        }
      },
      maxusers: {
        type: Sequelize.INTEGER
      },
      currentusers: {
        defaultValue:0,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      wish_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references:{
          model:"Wishes",
          key:"id"
        }
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
    await queryInterface.dropTable('Groups');
  }
};
