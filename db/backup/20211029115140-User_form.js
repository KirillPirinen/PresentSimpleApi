'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Users', [{
        name: 'John',
        lname: 'Doe',
        phone: '79251231212',
        email:'ak0man19@gmail.com',
        password:'123',
        createdAt:new Date(),
        updatedAt:new Date()
      }], {});
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
