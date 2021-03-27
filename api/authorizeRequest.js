const { includes, pick } = require('lodash/fp');
const { getUserByToken } = require('./models/users');

/**
 * Authorize a request
 * Without parameters, a route will
 * be scoped to admin, to add any
 * other scopes, an array of roles
 * can be passed
 * @param {array} roles
 */
module.exports = (roles = [], passThrough) => (req, res, next) => {
    roles = [...roles, 'admin'];

    const token = req.cookies.access_token;

    if (!token && !passThrough) {
        return res.sendStatus(401);
    }

    getUserByToken(token).then((user) => {
        if (includes(user.role, roles)) {
            req.user = pick(['id', 'username', 'role'], user);
            next();
        } else if (passThrough) {
            next();
        } else {
            res.sendStatus(401);
        }
    });
};
