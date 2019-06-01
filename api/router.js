const express = require('express');
const router = express.Router();

const authorizeRequest = require('./authorizeRequest');

router.get('', authorizeRequest('admin'), (req, res) => {
    res.send('Hello World');
})

router.use('/users', require('./routes/users'));
router.use('/restaurants', require('./routes/restaurants'));
router.use('/reviews', require('./routes/reviews'));

module.exports = router;