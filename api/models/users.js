const db = require('../lib/db');
const { forEach, join, includes } = require('lodash/fp');
const forEachWithKeys = forEach.convert({ cap: false });

const FIELDS = ['username', 'role'];

module.exports = {
    createUser,
    getUserByUsername,
    getUserByToken,
    getOwnerByReview,
    deleteUser,
    updateUser,
};

function createUser(username, password, salt, role = 'user') {
    return db.query(
        `
        insert into users (username, password, salt, role)
        values ($1, $2, $3, $4)
        returning id
    `,
        [username, password, salt, role],
    );
}

function getUserByUsername(username) {
    return db.query(
        `
        select *
        from users
        where username = $1
    `,
        [username],
    );
}

function getUserByToken(token) {
    return db.query(
        `
        select *
        from users
        where id = (
            select "user"
            from access_tokens
            where token = $1
        )
    `,
        [token],
    );
}

function getOwnerByReview(review) {
    return db.query(
        `
        select *
        from users
        where id = (
            select owner
            from restaurants
            where id = $1
        )
    `,
        [review],
    );
}

function deleteUser(user) {
    return db.query(
        `
        delete from users
        where id = $1
    `,
        [user],
    );
}

function updateUser(user, options) {
    const values = [];
    const updates = [];

    forEachWithKeys((value, field) => {
        if (includes(field, FIELDS)) {
            values.push(value);
            updates.push(`${field} = $${values.length}`);
        }
    }, options);

    values.push(user);

    const query = `
        update users
        set ${join(', ', update)}
        where id = $${values.length}`;

    return db.query(query, values);
}
