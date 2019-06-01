const db = require('../lib/db');

module.exports = {
    setAuthToken(token, user) {
        return db.query(
            `
            insert into access_tokens (token, "user")
            values ($1, $2)
        `,
            [token, user],
        );
    },
};
