const express = require('express');
const router = express.Router();

const authorizeRequest = require('./authorizeRequest');

router.use('/users', require('./routes/users'));
router.use('/restaurants', require('./routes/restaurants'));
router.use('/reviews', require('./routes/reviews'));

module.exports = router;
