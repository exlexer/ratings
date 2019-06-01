const express = require('express');
const router = express.Router();
const { get, getOr } = require('lodash/fp');

const { createRestaurant, getRestaurants, getRestaurantsByOwner } = require('../models/restaurants');

const authorize = require('../authorizeRequest');

/**
 * Add new restaurant
 * @param {string} name
 * @param {string} owner
 */
router.post('', authorize('owner'), (req, res, next) => {
    const { name } = req.body;
    const owner = getOr(get(['user', 'username'], req), ['body', 'owner'], req);

    createRestaurant(name, owner)
        .then((data) => {
            res.json(data);
        })
        .catch(next);
})

/**
 * Get all restaurant
 */
router.get('', authorize(), (req, res, next) => {
    if (req.user.role === 'owner') {
        getRestaurantsByOwner(req.user.id)
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    } else {
        getRestaurants()
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }
})

module.exports = router;