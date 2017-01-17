var express = require('express'),
    router = express.Router(),
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

module.exports = router;
