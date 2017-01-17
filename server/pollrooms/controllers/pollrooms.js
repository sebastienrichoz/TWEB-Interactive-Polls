var express = require('express'),
    router = express.Router(),
    Pollroom = require('../models/Pollroom');

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
            return res.status(201).json(pollroom);
        })
        .catch(function(err) {
            console.log(err);
            return res.status(400).send(err);
        });
});

router.get('/:pollroom_id/', function(req, res) {
    Pollroom
        .findById(req.params.pollroom_id)
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
