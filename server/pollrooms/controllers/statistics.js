var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Pollroom = require('../models/Pollroom'),
    Question = require('../models/Question'),
    Answer = require('../models/Answer');

router.get('/', function(req, res) {
    Promise
        .all([
            Pollroom.count().exec(),
            Question.count().exec(),
            Answer.count().exec()
        ])
        .then(function(values) {
            return res.json({
                nb_pollrooms: values[0],
                nb_questions: values[1],
                nb_answers: values[2]
            });
        })
        .catch(function(err) {
            console.log(err);
            return res.status(400).send(err);
        });
});

module.exports = router;
