var express = require('express'),
    router = express.Router(),
    users = require('./users.api');

router.use('/users', users);

module.exports = router;
