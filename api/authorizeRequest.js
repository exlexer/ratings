const { indexOf, pick } = require('lodash/fp');

const { getUserByToken } = require('./models/users');

const ROLES = ['user', 'owner', 'admin'];

module.exports = (role = 'user') => (req, res, next) => {
    const token = req.cookies.access_token;

    getUserByToken(token).then(user => {
        roleIndex = indexOf(user.role, ROLES);
        neededIndex = indexOf(role, ROLES);

        if (roleIndex >= neededIndex) {
            req.user = pick(['id', 'username', 'role'], user);
            next();
        } else {
            res.sendStatus(401);
        }
    });
};
