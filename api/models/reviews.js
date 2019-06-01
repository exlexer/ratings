const db = require('../lib/db');

module.exports = {
    createReview(user, restaurant, rate, date, comment) {
        return db.query(`
            insert into reviews ("user", restaurant, rate, visit_date, comment)
            values ($1, $2, $3, $4, $5)
            returning *
        `, [user, restaurant, rate, date, comment]);
    },
    replyToReview(review, reply) {
        return db.query(`
            update reviews
            set reply = $2
            where id = $1
            returning *
        `, [review, reply]);
    }
};