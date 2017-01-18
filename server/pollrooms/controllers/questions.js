var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Pollroom = require('../models/Pollroom'),
    Question = require('../models/Question'),
    Answer = require('../models/Answer'),
    Vote = require('../models/Vote');

router.post('/', function(req, res) {
    var question = new Question({
        title: req.body.title,
        creator: req.get('X-Session-ID'),
        pollroom: req.body.pollroom
    });
    var answers = [];
    for (var k in req.body.answers) {
        var answer = new Answer({
            label: req.body.answers[k],
            question: question
        });
        answers.push(answer);
        question.answers.push(answer);
    }

    Promise
        .each(answers, function(answer) {
            return answer.save();
        })
        .then(function() {
            return question.save();
        })
        .then(function(question) {
            return Pollroom
                .findByIdAndUpdate(question.pollroom, { $push: { 'questions': question }})
                .populate({ path: 'questions', model: 'Question', populate: { path: 'answers', model: 'Answer' }})
                .exec();
        })
        .then(function(pollroom) {
            if (pollroom == null) {
                throw new Error(404);
            }

            return Question
                .findById(question._id)
                .populate({ path: 'answers', model: 'Answer' })
                .exec();
        })
        .then(function(question) {
            res.io.to(question.pollroom.identifier).emit('newQuestion', question);
            return res.status(201).json(question);
        })
        .catch(function(err) {
            if (err.message != undefined && err.message == 404) {
                return res.status(404).send();
            }
            console.log(err);
            return res.status(400).send(err);
        });
});

router.get('/:question_id/', function(req, res) {
    Question
        .findById(req.params.question_id)
        .populate({ path: 'answers', model: 'Answer' })
        .exec()
        .then(function(question) {
            if (question == null) {
                return res.status(404).send();
            }
            return res.json(question);
        })
        .catch(function(err) {
            console.log(err);
            return res.status(400).send(err);
        });
});

router.patch('/:question_id/', function(req, res) {
    var data = {};
    if (req.body.status != undefined) {
        data.status = req.body.status;
    }
    if (req.body.title != undefined) {
        data.title = req.body.title;
    }
    if (req.body.answers != undefined) {
        data.answers = req.body.answers; // TODO (modif de sebri) avant c'était : data.answers = req.body.status
    }

    console.log(data); // TODO sebri a mis ça

    Question
        .findByIdAndUpdate(req.params.question_id, { $set: data }, { new: true })
        .populate({ path: 'answers', model: 'Answer' })
        .exec()
        .then(function(question) {
            if (question == null) {
                return res.status(404).send();
            }
            res.io.to(question.pollroom.identifier).emit('updateQuestion', question);
            return res.json(question);
        })
        .catch(function(err) {
            console.log(err);
            return res.status(400).send(err);
        });
});

function vote(question_id, user, up) {
    var data = {
        question: question_id,
        user: user,
        up: up
    };

    return Question
        .findById(data.question)
        .exec()
        .then(function(question) {
            if (question == null) {
                throw new Error(404);
            }

            // create if not exist, no effect if exists
            return Vote
                .findOneAndUpdate({ 'question': data.question, 'user': data.user }, data, { upsert: true })
                .exec()
        })
        .then(function() {
            return Question.updateVotesCount(data.question);
        })
        .then(function() {
            return Question.findById(data.question).exec();
        });
}

router.post('/:question_id/voteup/', function(req, res) {
    return vote(req.params.question_id, req.get('X-Session-ID'), true)
        .then(function(question) {
            res.io.to(question.pollroom.identifier).emit('updateQuestion', vote.question);
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

router.post('/:question_id/votedown/', function(req, res) {
    return vote(req.params.question_id, req.get('X-Session-ID'), false)
        .then(function(question) {
            res.io.to(question.pollroom.identifier).emit('updateQuestion', vote.question);
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
