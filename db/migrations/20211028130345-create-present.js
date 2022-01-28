'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Presents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull:false,
        type: Sequelize.STRING
      },
      description: {
        allowNull:true,
        defaultValue:null,
        type: Sequelize.STRING
      },
      isBinded: {
        defaultValue:false,
        type: Sequelize.BOOLEAN,
      },
      isGiven: {
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      form_id: {
        allowNull:false,
        type: Sequelize.UUID,
        references:{
          model:"Forms",
          key:'id'
        }
      },
      pricerange_id: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references:{
          model:"PriceRanges",
          key:'id'
        }
      },
      user_id: {
        defaultValue:null,
        type: Sequelize.INTEGER,
        references:{
          model:"Users",
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
    await queryInterface.dropTable('Presents');
  }
};
