const db = require('../lib/db');

module.exports = {
    createUser(username, password, salt, role = 'user') {
        return db.query(`
            insert into users (username, password, salt, role)
            values ($1, $2, $3, $4)
            returning id
        `, [username, password, salt, role]);
    },
    getUserByUsername(username) {
        return db.query(`
            select *
            from users
            where username = $1
        `, [username]);
    },
    getUserByToken(token) {
        return db.query(`
            select *
            from users
            where id = (
                select "user"
                from access_tokens
                where token = $1
            )
        `, [token]);
    },
    getOwnerByReview(review) {
        return db.query(`
            select *
            from users
            where id = (
                select owner
                from restaurants
                where id = $1
            )
        `, [review])
    }
};