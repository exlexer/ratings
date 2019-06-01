const express = require('express');
const router = express.Router();

const { createReview, replyToReview } = require('../models/reviews');
const { getOwnerByReview } = require('../models/users');

const authorize = require('../authorizeRequest');

/**
 * Add new review
 * @param {number} restaurant
 * @param {number} rate
 * @param {date} date
 * @param {string} comment
 */
router.post('', authorize(), (req, res, next) => {
    const { restaurant, rate, date, comment } = req.body;

    createReview(req.user.id, restaurant, rate, date, comment)
        .then(() => {
            res.json({ message: 'Success!' });
        })
        .catch(next);
});

/**
 * Add new review
 * @param {number} restaurant
 * @param {number} rate
 * @param {date} date
 * @param {string} comment
 */
router.post('/reply', authorize('owner'), (req, res, next) => {
    const { review, reply } = req.body;

    getOwnerByReview(review)
        .then(data => {
            if (data.id === req.user.id) {
                return replyToReview(review, reply)
            } else {
                res.sendStatus(401);
                throw new Error('Unauthorized');
            }
        })
        .then(() => {
            res.json({ message: 'Success!' });
        })
        .catch(next);
});

module.exports = router;