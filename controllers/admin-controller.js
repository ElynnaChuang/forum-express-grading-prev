// 前台restaurant專用的controller
const { Restaurant } = require('../models')

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

    Restaurant.create({ name, tel, address, openingHours, description })
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
  }
}

module.exports = adminController
