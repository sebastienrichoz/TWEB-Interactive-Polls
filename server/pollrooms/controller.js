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
            res.json(err);
        }
        res.json(pollroom);
    });
});

router.get('/:pollroom_id/', function(req, res) {
    Pollroom.findById(req.params.pollroom_id, function(err, pollroom) {
        if (err) {
            res.send(err);
        }
        res.json(pollroom);
    });
});

router.patch('/:pollroom_id/', function(req, res) {
    Pollroom.findById(req.params.pollroom_id, function(err, pollroom) {
        if (err) {
            res.send(err);
        }
        if (req.body.status != undefined) {
            pollroom.status = req.body.status;
        }
        pollroom.save(function(err, pollroom) {
            if (err) {
                res.send(err);
            }
            res.json(pollroom);
        });
    });
});

router.post('/:pollroom_id/questions/', function(req, res) {
    Pollroom.findById(req.params.pollroom_id, function(err, pollroom) {
        if (err) {
            res.send(err);
        }
        var question = new Question({
            title: req.body.title,
            creator: req.get('X-Session-ID')
        });
        for (var a in req.body.answers) {
            question.answers.push(new Answer({
                label: a
            }));
        }
        pollroom.questions.push(question);
        pollroom.save(function(err, question) {
            if (err) {
                res.json(err);
            }
            res.json(question);
        });
    });
});

router.get('/questions/:question_id', function(req, res) {
    Question.find(req.params.question_id, function(err, question) {
        if (err) {
            res.send(err);
        }
        res.json(question);
    });
});

router.patch('/questions/:question_id', function(req, res) {
    var data = {};
    if (req.body.status != undefined) {
        data.status = req.body.status;
    }
    if (req.body.title != undefined) {
        data.status = req.body.title;
    }
    if (req.body.answers != undefined) {
        data.status = req.body.answers;
    }
    Question.update(req.params.question_id, data, function(err, numAffected) {
        if (err) {
            res.send(err);
        }
        res.json(numAffected);
    });
});
    });
});

module.exports = router;
