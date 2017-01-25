var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Pollroom = require('../models/Pollroom'),
    Question = require('../models/Question'),
    Answer = require('../models/Answer'),
    Choice = require('../models/Choice'),
    Vote = require('../models/Vote'),
    gamification = require('../../gamification/gamification-api'),
    eventtypes = require('../../gamification/eventtypes');

router.post('/:answer_id/check/', function(req, res) {
    var data = {
        pollroom: null,
        question: null,
        answer: req.params.answer_id,
        user: req.get('X-Session-ID')
    };

    Answer
        .findById(data.answer)
        .populate({ path: 'question', model: 'Question', populate: { path: 'pollroom', model: 'Pollroom' }})
        .exec()
        .then(function(answer) {
            if (answer == null) {
                throw new Error(404);
            }

            data.question = answer.question._id;
            data.pollroom = answer.question.pollroom._id;

            return Choice
                .findOneAndUpdate(data, data, { upsert: true }) // create if not exist, no effect if exists
                .exec()
        })
        .then(function(choice) {
            if (choice != null) {
                return new Promise.resolve();
            }

            return Answer.updateResponsesCount(data.answer);
        })
        .then(function() {
            return Question.findById(data.question).exec();
        })
        .then(function(question) {
            var eventtypesMap = eventtypes.getEventtypeMap();
            var event = {
                id: eventtypesMap.get('answer a question'),
                user: req.get('X-Session-ID')
            };
            gamification.postEvent(event);
            res.io.to(question.pollroom.identifier).emit('updateQuestion', question);
            return res.send();
        })
        .catch(function(err) {
            if (err.message != undefined && err.message == 404) {
                return res.status(404).send();
            }
            console.log(err);
            return res.status(400).send(err);
        });
});

router.post('/:answer_id/uncheck/', function(req, res) {
    var data = {
        pollroom: null,
        question: null,
        answer: req.params.answer_id,
        user: req.get('X-Session-ID')
    };

    Answer
        .findById(data.answer)
        .populate({ path: 'question', model: 'Question', populate: { path: 'pollroom', model: 'Pollroom' }})
        .exec()
        .then(function(answer) {
            if (answer == null) {
                throw new Error(404);
            }

            data.question = answer.question._id;
            data.pollroom = answer.question.pollroom._id;

            return Choice
                .remove(data) // remove if exists
                .exec()
        })
        .then(function(obj) {
            if (obj.result.n == 0) {
                return new Promise.resolve();
            }

            return Answer.updateResponsesCount(data.answer);
        })
        .then(function() {
            return Question.findById(data.question).exec();
        })
        .then(function(question) {
            res.io.to(question.pollroom.identifier).emit('updateQuestion', question);
            return res.send();
        })
        .catch(function(err) {
            if (err.message != undefined && err.message == 404) {
                return res.status(404).send();
            }
            console.log(err);
            return res.status(400).send(err);
        });
});

module.exports = router;
