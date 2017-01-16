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
    Pollroom.findById(req.params.pollroom_id, function(err, pollroom) {
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
        question.answers.push(new Answer({
            label: req.body.answers[k]
        }));
    }
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
    Pollroom.findOne({ 'questions._id': req.params.question_id }, function(err, pollroom) {
        if (err) {
            res.status(400).send(err);
        }
        else if (pollroom == null) {
            res.status(404).send(err);
        }
        res.json(pollroom.questions.id(req.params.question_id));
    });
});

router.patch('/questions/:question_id/', function(req, res) {
    var data = {};
    if (req.body.status != undefined) {
        data['questions.$.status'] = req.body.status;
    }
    if (req.body.title != undefined) {
        data['questions.$.title'] = req.body.title;
    }
    if (req.body.answers != undefined) {
        data['questions.$.answers'] = req.body.status;
    }
    Pollroom.findOneAndUpdate({ 'questions._id': req.params.question_id }, { $set: data }, { new: true }, function(err, pollroom) {
        if (err) {
            res.status(400).send(err);
        }
        else if (pollroom == null) {
            res.status(404).send(err);
        }
        res.json(pollroom.questions.id(req.params.question_id));
    });
});

router.post('/answers/:answer_id/check/', function(req, res) {
    Pollroom.findOne({ 'questions.answers._id': req.params.answer_id }, function(err, pollroom) {
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
        Choice.findOneAndUpdate(data, data, { upsert: true }, function(err, choice) {
            if (err) {
                res.status(400).send(err);
            }
            res.status(200).send();
        });
    });
});

router.post('/answers/:answer_id/uncheck/', function(req, res) {
    Pollroom.findOne({ 'questions.answers._id': req.params.answer_id }, function(err, pollroom) {
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
        Choice.remove(data, function(err) {
            if (err) {
                res.status(400).send(err);
            }
            res.status(200).send();
        });
    });
});

module.exports = router;
