'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Comments', Array.from({ length: 50 }, () => ({
      text: faker.lorem.sentence(),
      created_at: new Date(),
      updated_at: new Date(),
      user_Id: users[Math.floor(Math.random() * users.length)].id,
      restaurant_Id: restaurants[Math.floor(Math.random() * restaurants.length)].id
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
