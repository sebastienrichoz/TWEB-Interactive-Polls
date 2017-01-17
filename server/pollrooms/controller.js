var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Pollroom = require('./models/Pollroom'),
    Question = require('./models/Question'),
    Answer = require('./models/Answer'),
    Choice = require('./models/Choice'),
    Vote = require('./models/Vote');

// socket io things
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen((process.env.PORT_SOCKET || 3001));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.emit('hello');

    socket.on('join', function(data){
        console.log(data);
        socket.join(data.room);
    });

    socket.on('disconnect', function(){
        console.log("disconnected");
    })
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
            return res.status(201).json(pollroom);
        })
        .catch(function(err) {
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
            return res.status(400).send(err);
        });
});

router.post('/:pollroom_id/questions/', function(req, res) {
    var question = new Question({
        title: req.body.title,
        creator: req.get('X-Session-ID'),
        pollroom: req.params.pollroom_id
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
                .findByIdAndUpdate(req.params.pollroom_id, { $push: { 'questions': question }})
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
            return res.status(201).json(question);
        })
        .catch(function(err) {
            if (err.message != undefined && err.message == 404) {
                return res.status(404).send();
            }
            return res.status(400).send(err);
        });
});

router.get('/questions/:question_id/', function(req, res) {
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
            return res.status(400).send(err);
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

    Question
        .findByIdAndUpdate(req.params.question_id, { $set: data }, { new: true })
        .populate({ path: 'answers', model: 'Answer' })
        .exec()
        .then(function(question) {
            if (question == null) {
                return res.status(404).send();
            }
            return res.json(question);
        })
        .catch(function(err) {
            return res.status(400).send(err);
        });
});

router.post('/answers/:answer_id/check/', function(req, res) {
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
            return res.send();
        })
        .catch(function(err) {
            if (err.message != undefined && err.message == 404) {
                return res.status(404).send();
            }
            return res.status(400).send(err);
        });
});

router.post('/answers/:answer_id/uncheck/', function(req, res) {
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
            return res.send();
        })
        .catch(function(err) {
            if (err.message != undefined && err.message == 404) {
                return res.status(404).send();
            }
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

            return Vote
                .findOneAndUpdate({ 'question': data.question, 'user': data.user }, data, { upsert: true }) // create if not exist, no effect if exists
                .exec()
        })
        .then(function() {
            return Question.updateVotesCount(data.question);
        });
}

router.post('/questions/:question_id/voteup', function(req, res) {
    return vote(req.params.question_id, req.get('X-Session-ID'), true)
        .then(function() {
            return res.send();
        })
        .catch(function(err) {
            if (err.message != undefined && err.message == 404) {
                return res.status(404).send();
            }
            return res.status(400).send(err);
        });
});

router.post('/questions/:question_id/votedown', function(req, res) {
    return vote(req.params.question_id, req.get('X-Session-ID'), false)
        .then(function() {
            return res.send();
        })
        .catch(function(err) {
            if (err.message != undefined && err.message == 404) {
                return res.status(404).send();
            }
            return res.status(400).send(err);
        });
});

module.exports = router;
