var express = require('express'),
    router = express.Router();


router.get('/', function(req, res, next) {
  res.send('get all users');
});


router.post('/', function(req, res, next) {
  res.send('get all users');
});


router.get('/:id', function(req, res, next) {
  res.send('get user ' + req.params.id);
});


// route middleware to validate :id
/*router.param('id', function(req, res, next, id) {
  //console.log('validating ' + id + ' exists');
  //find the ID in the Database
  mongoose.model('Blob').findById(id, function (err, blob) {
    //if it isn't found, we are going to repond with 404
    if (err) {
      console.log(id + ' was not found');
      res.status(404)
      var err = new Error('Not Found');
      err.status = 404;
      res.format({
        html: function(){
          next(err);
        },
        json: function(){
          res.json({message : err.status  + ' ' + err});
        }
      });
      //if it is found we continue on
    } else {
      //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
      //console.log(blob);
      // once validation is done save the new item in the req
      req.id = id;
      // go to the next thing
      next();
    }
  });
});*/


module.exports = router;
