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

    console.log(1);
    const token = req.cookies.access_token;

    if (!token && !passThrough) {
        return res.sendStatus(401);
    }

    console.log(2);
    getUserByToken(token).then((user) => {
        console.log(3);
        if (includes(user.role, roles)) {
            console.log(4);
            req.user = pick(['id', 'username', 'role'], user);
            next();
        } else if (passThrough) {
            console.log(5);
            next();
        } else {
            console.log(6);
            res.sendStatus(401);
        }
    });
};
