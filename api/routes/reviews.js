const express = require('express');
const router = express.Router();

const {
    createReview,
    getReviewsByRestaurants,
    replyToReview,
    deleteReview,
    updateReview,
} = require('../models/reviews');
const { getOwnerByReview } = require('../models/users');
const {
    getRestaurants,
    getRestaurantsByOwner,
} = require('../models/restaurants');

const authorize = require('../authorizeRequest');

/**
 * Add new review
 * @param {number} restaurant
 * @param {number} rate
 * @param {date} date
 * @param {string} comment
 */
router.post('', authorize(['user']), (req, res, next) => {
    const { restaurant, rate, date, comment } = req.body;

    createReview(req.user.id, restaurant, rate, date, comment)
        .then(() => res.json({ message: 'success' }))
        .catch(next);
});

/**
 * Reply to a review
 * @param {number} restaurant
 * @param {number} rate
 * @param {date} date
 * @param {string} comment
 */
router.post('/reply', authorize(['owner']), (req, res, next) => {
    const { review, reply } = req.body;

    getOwnerByReview(review)
        .then(data => {
            if (data.id === req.user.id) {
                return replyToReview(review, reply);
            } else {
                res.sendStatus(401);
                throw new Error('Unauthorized');
            }
        })
        .then(data => {
            res.json({ message: 'Success!' });
        })
        .catch(next);
});

/**
 * Deletes a review
 */
router.delete('/:id', authorize(), (req, res) =>
    deleteReview(req.params.id)
        .then(() => {
            req.json({ message: 'success' });
        })
        .catch(next),
);

/**
 * Updates a review
 */
router.patch('/:id', authorize(), (req, res) =>
    updateReview(req.params.id, req.body)
        .then(() => {
            req.json({ message: 'success' });
        })
        .catch(next),
);

module.exports = router;
