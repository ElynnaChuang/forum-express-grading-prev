'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先去查詢現在 users & restaurants 的 id 有哪些
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const result = []
    for (let i = 0; i < users.length; i++) {
      const newRests = Object.assign([], restaurants) // 先複製新的arr（因換一個user就要從新的開始）
      const restsCount = Math.floor(Math.random() * newRests.length) + 1 // 隨機1~...，user要有幾家收藏餐廳（＝要抽出餐廳的次數）

      for (let x = 1; x <= restsCount; x++) {
        const index = Math.floor(Math.random() * newRests.length) // 隨機抽一個index
        result.push({
          user_id: users[i].id,
          restaurant_id: newRests[index].id,
          created_at: new Date(),
          updated_at: new Date()
        })
        newRests.splice(index, 1) // 移除剛剛抽出的餐廳，避免重複
      }
    }
    await queryInterface.bulkInsert('Likes', result)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
