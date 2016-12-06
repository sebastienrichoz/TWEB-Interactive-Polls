var express = require('express'),
    router = express.Router(),
    Room = require('../../models/room.js');


router.post('/', function(req, res, next) {
    // TODO : mieux gérer entrées utilisateur
    var room = new Room(req.body);
    room.save(function(err, obj) {
        if (err) {
            res.status(422).json(err); // TODO : messages customs
        }
        res.status(201).json(obj); // TODO : ne pas retourner le champ password
    });
});

module.exports = router;
