var express = require('express'),
    router = express.Router(),
    Pollroom = require('./models/Pollroom'),
    Question = require('./models/Question'),
    Answer = require('./models/Answer'),
    Choice = require('./models/Choice'),
    Vote = require('./models/Vote');

router.post('/', function(req, res) {
    var pollroom = new Pollroom({
        name: req.body.name,
        creator: req.get('X-Session-ID')
    });
    pollroom.save(function(err, pollroom) {
        if (err) {
            res.status(400).send(err);
        }
        res.status(201).json(pollroom);
    });
});

router.get('/:pollroom_id/', function(req, res) {
    Pollroom.findById(req.params.pollroom_id).exec(function(err, pollroom) {
        if (err) {
            res.status(400).send(err);
        }
        else if (pollroom == null) {
            res.status(404).send(err);
        }
        res.json(pollroom);
    });
});

router.patch('/:pollroom_id/', function(req, res) {
    var data = {};
    if (req.body.status != undefined) {
        data.status = req.body.status;
    }
    Pollroom.findByIdAndUpdate(req.params.pollroom_id, { $set: data }, { new: true }, function(err, pollroom) {
        if (err) {
            res.status(400).send(err);
        }
        else if (pollroom == null) {
            res.status(404).send(err);
        }
        res.json(pollroom);
    });
});

router.post('/:pollroom_id/questions/', function(req, res) {
    var question = new Question({
        title: req.body.title,
        creator: req.get('X-Session-ID')
    });
    for (var k in req.body.answers) {
        var answer = new Answer({
            label: req.body.answers[k]
        });
        answer.save(function(err) {
            if (err) {
                res.status(400).send(err);
            }
        });
        question.answers.push(answer);
    }
    question.save(function(err) {
        if (err) {
            res.status(400).send(err);
        }
    });
    Pollroom.findByIdAndUpdate(req.params.pollroom_id, { $push: { 'questions': question }}, function(err, pollroom) {
        if (err) {
            res.status(400).send(err);
        }
        else if (pollroom == null) {
            res.status(404).send(err);
        }
        res.status(201).json(question);
    });
});

router.get('/questions/:question_id/', function(req, res) {
    Question.findById(req.params.question_id, function(err, question) {
        if (err) {
            res.status(400).send(err);
        }
        else if (question == null) {
            res.status(404).send(err);
        }
        res.json(question);
    });
});

router.patch('/questions/:question_id/', function(req, res) {
    var data = {};
    if (req.body.status != undefined) {
        data.status = req.body.status;
    }
    if (req.body.title != undefined) {
        data.title = req.body.title;
    }
    if (req.body.answers != undefined) {
        data.answers = req.body.status;
    }
    Question.findByIdAndUpdate(req.params.question_id, { $set: data }, { new: true }, function(err, question) {
        if (err) {
            res.status(400).send(err);
        }
        else if (question == null) {
            res.status(404).send(err);
        }
        res.json(question);
    });
});

router.post('/answers/:answer_id/check/', function(req, res) {
    Answer.findById(req.params.answer_id, function(err, answer) {
        if (err) {
            res.status(400).send(err);
        }
        else if (answer == null) {
            res.status(404).send(err);
        }
        var data = {
            answer: req.params.answer_id,
            user: req.get('X-Session-ID')
        };
        Choice.findOneAndUpdate(data, data, { upsert: true }, function(err) {
            if (err) {
                res.status(400).send(err);
            }
            res.status(200).send();
        });
    });
});

router.post('/answers/:answer_id/uncheck/', function(req, res) {
    Answer.findById(req.params.answer_id, function(err, answer) {
        if (err) {
            res.status(400).send(err);
        }
        else if (pollroom == null) {
            res.status(404).send(err);
        }
        var data = {
            answer: req.params.answer_id,
            user: req.get('X-Session-ID')
        };
        Choice.delete(data, function(err) {
            if (err) {
                res.status(400).send(err);
            }
            res.status(200).send();
        });
    });
});

module.exports = router;
