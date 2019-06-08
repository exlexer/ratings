const express = require('express');
const router = express.Router();

const {
    getUsers,
    createUser,
    getUserByUsername,
    deleteUser,
    updateUser,
} = require('../models/users');
const { setAuthToken } = require('../models/auth');
const { hashPassword, checkPassword, getAuthToken } = require('../lib/auth');

const authorize = require('../authorizeRequest');

/**
 * Get all user
 */
router.get('', authorize(), (req, res, next) => {
    getUsers()
        .then(data => res.json(data))
        .catch(next);
});

/**
 * Add new user
 * @param {string} username
 * @param {string} password
 * @param {string} role
 */
router.post('', (req, res, next) => {
    const { username, password } = req.body;

    const [hashed, salt] = hashPassword(password);

    let token;

    createUser(username, hashed, salt, 'user')
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

/**
 * Logout a user
 */
router.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('role');
    res.send();
});

/**
 * Deletes a user
 */
router.delete('/:id', authorize(), (req, res, next) => {
    deleteUser(req.params.id)
        .then(() => {
            res.json({ message: 'success' });
        })
        .catch(next);
});

/**
 * Updates a user
 */
router.patch('/:id', authorize(), (req, res, next) => {
    updateUser(req.params.id, req.body)
        .then(() => {
            res.json({ message: 'success' });
        })
        .catch(next);
});

module.exports = router;
