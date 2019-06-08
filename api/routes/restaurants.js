const express = require('express');
const router = express.Router();
const { isArray, toNumber, map } = require('lodash/fp');
const mapWithKeys = map.convert({ cap: false });

const {
    createRestaurant,
    getRestaurants,
    getRestaurantsByOwner,
    deleteRestaurant,
    updateRestaurant,
} = require('../models/restaurants');
const {
    getReviewsByRestaurant,
    updateReview,
    deleteReview,
} = require('../models/reviews');

const authorize = require('../authorizeRequest');

/**
 * Add new restaurant
 * @param {string} name
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
    const gettingRestaurants =
        req.user.role === 'owner'
            ? getRestaurantsByOwner(req.user.id)
            : getRestaurants();

    let _restaurants;

    gettingRestaurants
        .then(restaurants => {
            _restaurants = isArray(restaurants) ? restaurants : [restaurants];
            return Promise.all(
                map(
                    ({ id }) =>
                        getReviewsByRestaurant(id, req.user.role !== 'owner'),
                    _restaurants,
                ),
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
router.delete('/:id', authorize(), (req, res, next) =>
    deleteRestaurant(req.params.id)
        .then(() => {
            res.json({ message: 'success' });
        })
        .catch(next),
);

/**
 * Updates a restaurant
 */
router.patch('/:id', authorize(), (req, res, next) =>
    updateRestaurant(req.params.id, req.body)
        .then(() => {
            res.json({ message: 'success' });
        })
        .catch(next),
);

/**
 * Updates a restaurant's review
 */
router.patch('/:id/reviews/:review', authorize(), (req, res, next) =>
    updateReview(req.params.id, req.params.review, req.body)
        .then(() => {
            res.json({ message: 'success' });
        })
        .catch(next),
);

/**
 * Deletes a restaurant's review
 */
router.delete('/:id/reviews/:review', authorize(), (req, res, next) =>
    deleteReview(req.params.id, req.params.review)
        .then(() => {
            res.json({ message: 'success' });
        })
        .catch(next),
);

module.exports = router;
