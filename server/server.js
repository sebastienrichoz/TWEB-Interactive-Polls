var express = require('express'),
    path = require('path'),
    morgan = require('morgan'), // logger
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    pollrooms = require('./pollrooms/controllers/pollrooms'),
    questions = require('./pollrooms/controllers/questions'),
    answers = require('./pollrooms/controllers/answers'),
    statistics = require('./pollrooms/controllers/statistics');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('port', (process.env.PORT || 3000));

app.use(morgan('dev')); // log requests to the console

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(__dirname + '/../dist'));

// database
mongoose.Promise = require('bluebird');
var db = mongoose.connect(process.env.MONGODB_URI).connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');


    // controllers
    app.use('/api/v1/pollrooms/', pollrooms);
    app.use('/api/v1/questions/', questions);
    app.use('/api/v1/answers/', answers);
    app.use('/api/v1/statistics/', statistics);

    // all other controllers are handled by Angular
    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname,'/../dist/public/index.html'));
    });

    // init express.js listening
    app.listen(app.get('port'), function() {
        console.log('Application listening on port ' + app.get('port'));
    });

    // init socket io listening
    server.listen((process.env.PORT_SOCKET || 3001));
    io.on('connection', function(socket){

        socket.emit('hello');

        socket.on('join', function(data) {
            console.log(data);
            socket.join(data.room);
            io.to(data.room).emit('participantArrived');
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

        socket.on('voteUp', function(data) {
            console.log('voteUp');
            io.to(data.room).emit('voteUp', { question_id: data.question_id });
        });

        socket.on('voteDown', function(data) {
            console.log('voteDown');
            io.to(data.room).emit('voteDown', { question_id: data.question_id });
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
           io.to(data.room).emit('participantLeft');
        });

        socket.on('disconnect', function() {
            console.log('disconnected');
        });
    });

});

module.exports = app;
