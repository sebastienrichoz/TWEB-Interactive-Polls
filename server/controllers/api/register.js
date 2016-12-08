var express = require('express'),
    router = express.Router(),
    User = require('../../models/user.js');


router.post('/', function(req, res, next) {
    // TODO : mieux gérer entrées utilisateur
    var user = new User(req.body);
    // TODO : control mot de passe
    user.save(function(err, obj) {
        if (err) {
            res.status(422).json(err); // TODO : messages customs
        }
        res.status(201).json(obj); // TODO : ne pas retourner le champ password
    });
});

module.exports = router;
