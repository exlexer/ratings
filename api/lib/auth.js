const md5 = require('md5');
const crypto = require('crypto');
const sha512 = require('js-sha512');

module.exports = {
    hashPassword(password) {
        const salt = crypto.randomBytes(128).toString('base64');
        return [md5(password + salt), salt];
    },
    checkPassword(hashed, salt, password) {
        return md5(password + salt) === hashed;
    },
    getAuthToken(username) {
        return sha512(`${crypto.randomBytes(128)}-${username}-${new Date().toDateString()}`).substring(0, 40);
    },
};
