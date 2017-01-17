var express = require('express'),
    path = require('path'),
    morgan = require('morgan'), // logger
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    pollrooms = require('./pollrooms/controller');


var app = express();

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

    // all other controllers are handled by Angular
    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname,'/../dist/index.html'));
    });


    // init express.js listening
    app.listen(app.get('port'), function() {
        console.log('Application listening on port ' + app.get('port'));
    });
});

module.exports = app;
