var express = require('express'),
    router = express.Router(),
    register = require('./register'),
    rooms = require('./rooms');

router.use('/register', register);
router.use('/rooms', rooms);

module.exports = router;
