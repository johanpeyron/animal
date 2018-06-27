var express = require('express');
var router = express.Router();

/* GET animals */
router.get('/animals', (req, res) => {
  var db = req.db;
  var collection = db.get('animals');
  collection.find({}, {}, (e, docs) => {
    res.json(docs);
  });
});

/* POST to animalsroute */
router.post('/addanimal', function (req, res) {
  var db = req.db;
  var collection = db.get('animals');
  collection.insert(req.body, function (err, result) {
    res.send(
      (err === null) ? {
        msg: ''
      } : {
        msg: err
      }
    );
  });
});

/* DELETE to delete an animal */
router.delete('/deleteanimal/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('animals');
  var userToDelete = req.params.id;
  collection.remove({
    '_id' : userToDelete
  }, function (err) {
    res.send((err === null) ? {
      msg: ''
    } : {
      msg: 'error ' + err
    });
  });
});

module.exports = router;