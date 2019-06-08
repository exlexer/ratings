const express = require('express');
const router = express.Router();

router.use('/users', require('./routes/users'));
router.use('/restaurants', require('./routes/restaurants'));

module.exports = router;
