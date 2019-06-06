const db = require('../lib/db');
const { map, isArray, filter, forEach, join, includes } = require('lodash/fp');
const forEachWithKeys = forEach.convert({ cap: false });

const FIELDS = ['restaurant', 'rate', 'visit_date', 'comment'];

module.exports = {
    createReview,
    replyToReview,
    getReviewsByRestaurant,
    deleteReview,
    updateReview,
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
    return new Promise((resolve, reject) => {
        Promise.all([
            db.query(
                `
                    select *,
                        (select username from users where id = r.user)
                    from reviews r
                    where restaurant = $1
                `,
                [restaurant],
            ),
            db.query(
                `
                    select *,
                    (select username from users where id = r.user)
                    from reviews r
                    where restaurant = $1
                    order by visit_date desc
                    limit 3
                `,
                [restaurant],
            ),
            db.query(
                `
                    select *,
                    (select username from users where id = r.user)
                    from reviews r
                    where restaurant = $1
                    order by rate desc
                    limit 1
                `,
                [restaurant],
            ),
            db.query(
                `
                    select *,
                    (select username from users where id = r.user)
                    from reviews r
                    where restaurant = $1
                    order by rate asc
                    limit 1
                `,
                [restaurant],
            ),
        ])
            .then(([reviews, lastThree, highest, lowest]) => {
                let results = {};
                forEachWithKeys(
                    (data, key) => {
                        if (data.command) {
                            data = [];
                        }
                        if (!isArray(data)) {
                            data = [data];
                        }
                        results[key] = data;
                    },
                    { reviews, lastThree, highest, lowest },
                );
                resolve(results);
            })
            .catch(reject);
    });
}

function deleteReview(review) {
    return db.query(
        `
        delete from reviews
        where id = $1
    `,
        [review],
    );
}

function updateReview(review, options) {
    const values = [];
    const updates = [];

    forEachWithKeys((value, field) => {
        if (includes(field, FIELDS)) {
            values.push(value);
            updates.push(`${field} = $${values.length}`);
        }
    }, options);

    values.push(review);

    const query = `
        update users
        set ${join(', ', update)}
        where id = $${values.length}`;

    return db.query(query, values);
}
