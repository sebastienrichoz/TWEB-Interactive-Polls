var express = require('express'),
    router = express.Router(),
    Pollroom = require('./models/Pollroom'),
    Question = require('./models/Question'),
    Answer = require('./models/Answer');

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
        else {
            res.json(pollroom);
        }
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
        else {
            res.json(pollroom);
        }
    });
});

router.post('/:pollroom_id/questions/', function(req, res) {
    var question = new Question({
        title: req.body.title,
        creator: req.get('X-Session-ID')
    });
    for (var a in req.body.answers) {
        question.answers.push(new Answer({
            label: a
        }));
    }
    Pollroom.findByIdAndUpdate(req.params.pollroom_id, { $push: { 'questions': question }}, function(err, pollroom) {
        if (err) {
            res.status(400).send(err);
        }
        else if (pollroom == null) {
            res.status(404).send(err);
        }
        else {
            res.status(201).json(question);
        }
    });
});

router.get('/questions/:question_id/', function(req, res) {
    Pollroom.findOne({'questions._id': req.params.question_id}, function(err, pollroom) {
        if (err) {
            res.status(400).send(err);
        }
        else if (pollroom == null) {
            res.status(404).send(err);
        }
        else {
            res.json(pollroom.questions.id(req.params.question_id));
        }
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
    Pollroom.findOneAndUpdate({'questions._id': req.params.question_id}, { $set: data }, { new: true }, function(err, pollroom) {
        if (err) {
            res.status(400).send(err);
        }
        else if (pollroom == null) {
            res.status(404).send(err);
        }
        else {
            res.json(pollroom.questions.id(req.params.question_id));
        }
    });
});

module.exports = router;
