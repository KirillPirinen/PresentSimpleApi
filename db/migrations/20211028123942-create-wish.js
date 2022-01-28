'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Wishes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      isBinded: {
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      isGiven: {
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      user_id: {
        defaultValue:null,
        type: Sequelize.INTEGER,
        references:{
          model:"Users",
          key:"id"
        }
      },
      pricerange_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"PriceRanges",
          key:"id"
        }
      },
      wishlist_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"Wishlists",
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
    await queryInterface.dropTable('Wishes');
  }
};
