var express = require('express'),
    path = require('path'),
    logger = require('morgan'), // logger
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    pollrooms = require('./pollrooms/controllers/pollrooms'),
    questions = require('./pollrooms/controllers/questions'),
    answers = require('./pollrooms/controllers/answers'),
    statistics = require('./pollrooms/controllers/statistics'),
    gamification = require('./gamification/controllers/gamification'),
    Pollroom = require('./pollrooms/models/Pollroom'),
    eventtypes = require('./gamification/eventtypes');

var app = express();
var socketio = require('socket.io');

app.use(logger('dev')); // log requests to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use('/', express.static(__dirname + '/../dist'));

// Associate eventtypes id
eventtypes.initEventtypes();

// init mongodb database
mongoose.Promise = require('bluebird');
var db = mongoose.connect(process.env.MONGODB_URI).connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {

    console.log('Connected to MongoDB');

    // init listening
    var server = app.listen(process.env.PORT || 3000);
    var io = socketio.listen(server);

    // injections
    app.use(function(req, res, next) {
        res.io = io;
        next();
    });

    // rest api
    app.use('/api/v1/pollrooms/', pollrooms);
    app.use('/api/v1/questions/', questions);
    app.use('/api/v1/answers/', answers);
    app.use('/api/v1/statistics/', statistics);
    app.use('/api/v1/gamification/', gamification);
    app.use('/api/*', function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // all other controllers are handled by Angular
    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname,'/../dist/public/index.html'));
    });

    // handle socket.io connections
    io.on('connection', function(socket){

        socket.emit('hello');

        socket.on('join', function(data) {
            console.log(data);
            socket.join(data.room);

            Pollroom
                .findOneAndUpdate({ 'identifier': data.room }, { '$inc': { 'nb_participants': 1 } })
                .then(function() {
                    io.to(data.room).emit('participantArrived');
                });
        });

        socket.on('newQuestion', function(data) {
            console.log('newQuestion');
            io.to(data.room).emit('newQuestion', { question: data.question });
        });

        socket.on('editingQuestion', function(data) {
            console.log('editingQuestion');
            io.to(data.room).emit('editingQuestion', { question_id: data.question_id });
        });

        socket.on('updateQuestion', function(data) {
            console.log('updateQuestion');
            io.to(data.room).emit('updateQuestion', { question: data.question });
        });


        socket.on('closeQuestion', function(data) {
            console.log('closeQuestion');
            io.to(data.room).emit('closeQuestion', { question_id: data.question_id });
        });

        socket.on('closePollroom', function(data) {
            console.log('closePollroom');
            io.to(data.room).emit('closePollroom');
        });

        socket.on('voteUp', function(data) {
            console.log('voteUp');
            io.to(data.room).emit('voteUp', { question_id: data.question_id });
        });

        socket.on('cancelVoteUp', function(data) {
            console.log('cancelVoteUp');
            io.to(data.room).emit('cancelVoteUp', { question_id: data.question_id });
        });

        socket.on('voteDown', function(data) {
            console.log('voteDown');
            io.to(data.room).emit('voteDown', { question_id: data.question_id });
        });

        socket.on('cancelVoteDown', function(data) {
            console.log('cancelVoteDown');
            io.to(data.room).emit('cancelVoteDown', { question_id: data.question_id });
        });

        socket.on('answerChecked', function(data) {
            io.to(data.room).emit('answerChecked', { answer_id: data.answer_id });
        });

        socket.on('answerUnchecked', function(data) {
            console.log('answerUnchecked');
            io.to(data.room).emit('answerUnchecked', { answer_id: data.answer_id });
        });

        socket.on('bye', function(data){
           console.log('bye');
           Pollroom
               .findOneAndUpdate({ 'identifier': data.room }, { '$inc': { 'nb_participants': -1 } })
               .then(function() {
                   io.to(data.room).emit('participantLeft');
               });
        });


        socket.on('disconnect', function() {
            console.log('disconnected');
        });
    });
});

module.exports = app;
