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

/* DELETE to reset database */
router.delete('/deleteanimal', function (req, res) {
  var db = req.db;
  var collection = db.get('animals');
  var docToDelete = 
  collection.remove({
    'date': { $gt: "1999-01-01T00:00:00.000Z" }
  }, function (err) {
    res.send((err === null) ? {
      msg: ''
    } : {
      msg: 'error ' + err
    });
  });
});

module.exports = router;