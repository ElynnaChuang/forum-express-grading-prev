'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const result = []
    for (let i = 0; i < users.length; i++) {
      // 先複製新的arr（因換一個user就要從新的開始）&& 將目前的User剔除在可追蹤的人之外
      const otherUsers = Array.from(users)
      otherUsers.splice(i, 1)

      const follingsCount = Math.floor(Math.random() * otherUsers.length) + 1 // 隨機1~...，user要follow幾個user（＝要抽出followings的次數）
      for (let x = 1; x <= follingsCount; x++) {
        const index = Math.floor(Math.random() * otherUsers.length) // 隨機抽一個index
        result.push({
          follower_id: users[i].id,
          following_id: otherUsers[index].id,
          created_at: new Date(),
          updated_at: new Date()
        })
        otherUsers.splice(index, 1) // 移除剛剛抽出的User，避免重複
      }
    }

    await queryInterface.bulkInsert('Followships', result)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
