var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Pollroom = require('../models/Pollroom'),
    Choice = require('../models/Choice'),
    gamification = require('../../gamification/gamification-api'),
    eventtypes = require('../../gamification/eventtypes');

router.get('/', function(req, res) {
    Promise
        .all([
            Pollroom
                .find({ 'creator': req.get('X-Session-ID') })
                .sort([['created_at', 'descending']])
                .exec(),
            Choice
                .find({})
                .distinct('pollroom')
                .exec()
                .then(function(ids) {
                    return Pollroom
                        .find({ _id: { '$in': ids }})
                        .sort([['created_at', 'descending']])
                        .exec()
                })
        ])
        .then(function(values) {
            return res.json({
                pollrooms_created: values[0],
                pollrooms_joined: values[1]
            });
        })
        .catch(function(err) {
            console.log(err);
            return res.status(400).send(err);
        });
});

router.post('/', function(req, res) {
    var identifier = Math.floor(Math.random() * 899999) + 100000;

    var pollroom = new Pollroom({
        name: req.body.name,
        identifier: identifier,
        creator: req.get('X-Session-ID')
    });

    pollroom
        .save()
        .then(function(pollroom) {
            var eventtypesMap = eventtypes.getEventtypeMap();
            var event = {
                id: eventtypesMap.get('create a room'),
                user: req.get('X-Session-ID')
            };
            gamification.postEvent(event);
            return res.status(201).json(pollroom);
        })
        .catch(function(err) {
            console.log(err);
            return res.status(400).send(err);
        });
});

router.get('/:pollroom_identifier/', function(req, res) {
    Pollroom
        .findOne({ 'identifier': req.params.pollroom_identifier })
        .populate({ path: 'questions', model: 'Question', populate: { path: 'answers', model: 'Answer' }})
        .exec()
        .then(function(pollroom) {
            if (pollroom == null) {
                return res.status(404).send();
            }
            var eventtypesMap = eventtypes.getEventtypeMap();
            var event = {
                id: eventtypesMap.get('join a room'),
                user: req.get('X-Session-ID')
            };
            gamification.postEvent(event);
            res.io.to(pollroom.identifier).emit('updatePollroom', pollroom);
            return res.json(pollroom);
        })
        .catch(function(err) {
            console.log(err);
            return res.status(400).send(err);
        });
});

router.patch('/:pollroom_id/', function(req, res) {
    var data = {};
    if (req.body.status != undefined) {
        data.status = req.body.status;
    }

    Pollroom
        .findByIdAndUpdate(req.params.pollroom_id, { $set: data }, { new: true })
        .populate({ path: 'questions', model: 'Question', populate: { path: 'answers', model: 'Answer' }})
        .exec()
        .then(function(pollroom) {
            if (pollroom == null) {
                return res.status(404).send();
            }
            return res.json(pollroom);
        })
        .catch(function(err) {
            console.log(err);
            return res.status(400).send(err);
        });
});

module.exports = router;
