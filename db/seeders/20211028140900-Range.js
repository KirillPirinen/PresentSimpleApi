'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('PriceRanges', [
       {
        from:0,
        to: 1000,
        createdAt:new Date(),
        updatedAt:new Date(),
      },
      {
        from:1000,
        to: 3000,
        createdAt:new Date(),
        updatedAt:new Date(),
      },
      {
        from:3000,
        to: 5000,
        createdAt:new Date(),
        updatedAt:new Date(),
      },
      {
        from:5000,
        to: 10000,
        createdAt:new Date(),
        updatedAt:new Date(),
      },
      {
        from:10000,
        to: null,
        createdAt:new Date(),
        updatedAt:new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
