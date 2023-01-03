// 前台restaurant專用的controller
const { Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers') // 將 file-helper 載進來，處理圖片

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  // Create
  createRestaurantPage: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name.trim()) throw new Error('Restaurant name is required!')

    const { file } = req // 拿出圖片
    imgurFileHandler(file) // 取得圖片路徑，因為是Promise物件，可接then
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      }))
      .then(() => {
        req.flash('success_msg', 'Restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  // Read
  getRestaurantDetail: (req, res, next) => {
    const { id } = req.params
    Restaurant.findByPk(id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant-detail', { restaurant })
      })
      .catch(err => {
        return next(err)
      })
  },
  // Update
  editRestaurantPage: (req, res, next) => {
    const { id } = req.params
    Restaurant.findByPk(id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => {
        return next(err)
      })
  },
  updateRestaurant: (req, res, next) => {
    const { file } = req
    const { id } = req.params
    const { name, tel, address, openingHours, description } = req.body
    if (!name.trim()) throw new Error('Restaurant name is required!')
    // 先後關係：處理圖片＆Restaurant.findByPk(id)無先後關係，But restaurant.update 一定要等前兩者都做完
    Promise.all([
      Restaurant.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // filePath 可能為：沒變更filePath=null，還是原來的，所以是 restaurant.image / 有變更，所以是filePath
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image
        })
      })
      .then(() => {
        req.flash('success_msg', 'Restaurant was successfully updated!')
        res.redirect('/admin/restaurants')
      })
      .catch(err => {
        return next(err)
      })
  },
  // Delete
  deleteRestaurant: (req, res, next) => {
    const { id } = req.params
    Restaurant.findByPk(id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        req.flash('success_msg', `${restaurant.toJSON().name} was successfully deleted!`)
        return restaurant.destroy()
      })
      .then(() => {
        res.redirect('/admin/restaurants')
      })
      .catch(err => {
        return next(err)
      })
  }
}

module.exports = adminController
