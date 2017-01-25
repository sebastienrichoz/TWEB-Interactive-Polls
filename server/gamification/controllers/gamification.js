var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    gamification = require('../gamification-api');

router.get('/user/', function(req, res) {
    var user_id = req.get('X-Session-ID');

    gamification.getUser(user_id)
        .then(function(user) {
            console.log(user);
            res.status(200).send(user);
        })
        .catch(function(err){
            res.status(403).send(err);
        });
});

router.get('/levels/', function(req, res) {
    var user_id = req.get('X-Session-ID');

    gamification.getLevels()
        .then(function(levels) {
            res.status(200).send(levels);
        })
        .catch(function(err){
            res.status(403).send(err);
        });
});

router.get('/badges/', function(req, res) {
    gamification.getBadges()
        .then(function(badges) {
            res.status(200).send(badges);
        })
        .catch(function(err){
            res.status(403).send(err);
        });
});

router.get('/eventtypes/', function(req, res) {
    gamification.getEventtypes()
        .then(function(eventtypes) {
            res.status(200).send(eventtypes);
        })
        .catch(function(err){
            res.status(403).send(err);
        });
});

router.get('/leaderboards/', function(req, res) {
    gamification.getLeaderboard()
        .then(function(leaderboard) {
            res.status(200).send(leaderboard);
        })
        .catch(function(err){
            res.status(403).send(err);
        });
});

module.exports = router;
