const express = require('express');
const router = express.Router();
const { get, getOr, filter, map } = require('lodash/fp');

const {
    createRestaurant,
    getRestaurants,
    getRestaurantsByOwner,
} = require('../models/restaurants');
const {
    createReview,
    getReviewsByRestaurants,
    replyToReview,
} = require('../models/reviews');

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
        .then(data => {
            res.json(data);
        })
        .catch(next);
});

/**
 * Get all restaurants
 */
router.get('', authorize(), (req, res, next) => {
    if (req.user.role === 'owner') {
        let _restaurants;
        getRestaurantsByOwner(req.user.id)
            .then(restaurants => {
                _restaurants = restaurants;
                return getReviewsByRestaurants(restaurants);
            })
            .then(data =>
                res.json(
                    map(
                        r => ({
                            ...r,
                            reviews: filter(re => re.restaurant === r.id, data),
                        }),
                        _restaurants,
                    ),
                ),
            )
            .catch(next);
    } else {
        getRestaurants()
            .then(data => {
                res.json(data);
            })
            .catch(next);
    }
});

module.exports = router;
