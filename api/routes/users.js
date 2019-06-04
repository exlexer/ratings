const express = require('express');
const router = express.Router();

const { createUser, getUserByUsername } = require('../models/users');
const { setAuthToken } = require('../models/auth');
const { hashPassword, checkPassword, getAuthToken } = require('../lib/auth');

const authorize = require('../authorizeRequest');

/**
 * Add new user
 * @param {string} username
 * @param {string} password
 * @param {string} role
 */
router.post('', (req, res, next) => {
    const { username, password, role } = req.body;

    const [hashed, salt] = hashPassword(password);

    let token;

    createUser(username, hashed, salt, role)
        .then(data => {
            token = getAuthToken(username);
            return setAuthToken(token, data.id);
        })
        .then(() => {
            res.json({ token });
        })
        .catch(next);
});

/**
 * Sign in user
 * @param {string} username
 * @param {string} password
 */
router.post('/signin', (req, res, next) => {
    const { username, password } = req.body;

    getUserByUsername(username)
        .then(({ password: hashed, salt, id, role }) => {
            if (checkPassword(hashed, salt, password)) {
                token = getAuthToken(username);
                res.cookie('access_token', token, {
                    maxAge: 900000,
                });
                res.cookie('role', role, {
                    maxAge: 900000,
                });
                return setAuthToken(token, id);
            } else {
                res.status(401);
            }
        })
        .then(() => res.send())
        .catch(next);
});

router.get('/logout', authorize(), (req, res) => {
    res.clearCookie('access_token');
    res.send();
});

module.exports = router;
