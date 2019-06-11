const express = require('express');
const router = express.Router();
const { isArray, toNumber, map, reduce } = require('lodash/fp');
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
    createReview,
    replyToReview,
} = require('../models/reviews');
const { getOwnerByRestaurant } = require('../models/users');

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
    const { sortBy = 'rating', sortOrder = 'desc' } = req.query;

    const gettingRestaurants =
        req.user.role === 'owner'
            ? getRestaurantsByOwner(sortBy, sortOrder, req.user.id)
            : getRestaurants(sortBy, sortOrder);

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

/**
 * Add new review
 * @param {number} rate
 * @param {date} date
 * @param {string} comment
 */
router.post('/:id/reviews', authorize(['user']), (req, res, next) => {
    const { rate, date, comment } = req.body;

    createReview(req.user.id, req.params.id, rate, date, comment)
        .then(({ id }) => res.json({ id }))
        .catch(next);
});

/**
 * Reply to a review
 * @param {string} comment
 */
router.post(
    '/:id/reviews/:review/reply',
    authorize(['owner']),
    (req, res, next) => {
        const { id, review } = req.params;
        const { comment } = req.body;

        getOwnerByRestaurant(id)
            .then(data => {
                if (data.id === req.user.id) {
                    return replyToReview(review, comment);
                } else {
                    res.sendStatus(401);
                    throw new Error('Unauthorized');
                }
            })
            .then(data => {
                res.json({ message: 'Success!' });
            })
            .catch(next);
    },
);

module.exports = router;
