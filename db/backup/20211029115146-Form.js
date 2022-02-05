'use strict';
const { v4 } = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Forms', [{
        id: v4(),
        name: 'John',
        lname: 'Doe',
        email: '2@mail.ru',
        phone: '79251231212',
        user_id:1,
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
