var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    gamification = require('../gamification-api');

router.get('/gamification/user/', function(req, res) {
    var user_id = req.get('X-Session-ID');

    gamification.getUser(user_id)
        .then(function(user) {
            res.status(200).send(user);
        })
        .catch(function(err){
            res.status(403).send(err);
        });
});

router.get('/gamification/leaderboards/', function(req, res) {
    gamification.getLeaderboard()
        .then(function(leaderboard) {
            res.status(200).send(leaderboard);
        })
        .catch(function(err){
            res.status(403).send(err);
        });
});

module.exports = router;
