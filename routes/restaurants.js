const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const restaurant = require('../models/restaurant')

//getting all
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find()
        res.json(restaurants)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//getting one
router.get('/:id', getRestaurant, (req, res) => {
    res.json(res.restaurant)
})
//creating one
router.post('/', async(req, res) => {
    const restaurant = new Restaurant({
        name: req.body.name,
        address: req.body.address,
        operationHours: req.body.operationHours,
        phoneNumber: req.body.phoneNumber
    })
    try {
        const newRestaurant = await restaurant.save()
        res.status(201).json(newRestaurant)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
//updating one
router.patch('/:id', getRestaurant, async (req, res) => {
    if(req.body.name != null) {
        res.restaurant.name = req.body.name
    }
    try {
        const updatedRestaurant = await res.restaurant.save()
        res.json(updatedRestaurant)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})
// deleting one
router.delete('/:id', getRestaurant, async (req, res) => {
    try {
        await Restaurant.deleteOne({ _id: req.params.id })
        res.json({ message: 'Deleted Restaurant'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//middleware
async function getRestaurant(req, res, next) {
    let restaurant
    try {
        restaurant = await Restaurant.findById(req.params.id)
        if (restaurant == null) {
            return res.status(404).json({ message: 'Cannot find restaurant'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.restaurant = restaurant
    next()
 }

module.exports = router