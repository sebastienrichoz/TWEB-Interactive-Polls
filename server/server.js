var express = require('express'),
    path = require('path'),
    morgan = require('morgan'), // logger
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    pollrooms = require('./pollrooms/controllers/pollrooms'),
    questions = require('./pollrooms/controllers/questions'),
    answers = require('./pollrooms/controllers/answers');

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

    // all other controllers are handled by Angular
    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname,'/../dist/index.html'));
    });

    // init express.js listening
    app.listen(app.get('port'), function() {
        console.log('Application listening on port ' + app.get('port'));
    });

    // init socket io listening
    server.listen((process.env.PORT_SOCKET || 3001));
    io.on('connection', function(socket){

        socket.on('join', function(data) {
            console.log(data);
            socket.join(data.room);
        });

        socket.on('disconnect', function() {
            console.log("disconnected");
        })
    });

});

module.exports = app;
