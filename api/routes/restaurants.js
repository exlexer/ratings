const express = require('express');
const router = express.Router();
const { toNumber, map } = require('lodash/fp');
const mapWithKeys = map.convert({ cap: false });

const {
    createRestaurant,
    getRestaurants,
    getRestaurantsByOwner,
    deleteRestaurant,
    updateRestaurant,
} = require('../models/restaurants');
const {
    createReview,
    getReviewsByRestaurant,
    replyToReview,
} = require('../models/reviews');

const authorize = require('../authorizeRequest');

/**
 * Add new restaurant
 * @param {string} name
 * @param {string} owner
 */
router.post('', authorize(['owner']), (req, res, next) =>
    createRestaurant(req.body.name, req.user.id)
        .then(data => {
            res.json(data);
        })
        .catch(next),
);

/**
 * Get all restaurants
 */
router.get('', authorize(['user', 'owner']), (req, res, next) => {
    const getting =
        req.user.role === 'owner'
            ? getRestaurantsByOwner(req.user.id)
            : getRestaurants();

    let _restaurants;

    getting
        .then(restaurants => {
            _restaurants = restaurants;
            return Promise.all(
                map(({ id }) => getReviewsByRestaurant(id), restaurants),
            );
        })
        .then(reviews =>
            res.json(
                mapWithKeys(
                    (r, index) => ({
                        ...r,
                        ...reviews[index],
                        highest: reviews[index].highest[0] || null,
                        lowest: reviews[index].lowest[0] || null,
                        rating: toNumber(r.rating) || 0,
                    }),
                    _restaurants,
                ),
            ),
        )
        .catch(next);
});

/**
 * Deletes a restaurant
 */
router.delete('/:id', authorize(), (req, res) =>
    deleteRestaurant(req.params.id)
        .then(() => {
            req.json({ message: 'success' });
        })
        .catch(next),
);

/**
 * Updates a restaurant
 */
router.patch('/:id', authorize(), (req, res) =>
    updateRestaurant(req.params.id, req.body)
        .then(() => {
            req.json({ message: 'success' });
        })
        .catch(next),
);

module.exports = router;
