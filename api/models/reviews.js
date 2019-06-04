const db = require('../lib/db');
const { map, filter } = require('lodash/fp');

module.exports = {
    createReview,
    replyToReview,
    getReviewsByRestaurant,
    getReviewsByRestaurants,
};

function createReview(user, restaurant, rate, date, comment) {
    return db.query(
        `
        insert into reviews ("user", restaurant, rate, visit_date, comment)
        values ($1, $2, $3, $4, $5)
    `,
        [user, restaurant, rate, date, comment],
    );
}

function replyToReview(review, reply) {
    return db.query(
        `
        update reviews
        set reply = $2
        where id = $1
        returning *
    `,
        [review, reply],
    );
}

function getReviewsByRestaurant(restaurant) {
    console.log(restaurant);
    return db.query(
        `
        select *
        from reviews
        where restaurant = $1
    `,
        [restaurant],
    );
}

function getReviewsByRestaurants(restaurants) {
    return Promise.all(
        map(r => getReviewsByRestaurant(r.id), restaurants),
    ).then(filter(r => !r.command));
}
