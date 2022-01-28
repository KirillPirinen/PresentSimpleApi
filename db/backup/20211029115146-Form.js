'use strict';
const { uuid } = require('uuidv4');
module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Forms', [{
        id: uuid(),
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
