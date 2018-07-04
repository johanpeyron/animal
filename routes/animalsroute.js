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
    'keep': { $lt: "1" }
  }, function (err) {
    res.send((err === null) ? {
      msg: ''
    } : {
      msg: 'error ' + err
    });
  });
});

/* DELETE to reset database */
router.delete('/deleteanimal2', function (req, res) {
  var db = req.db;
  var collection = db.get('animals');
  var docToDelete = 
  collection.remove({
    'id': { $gt: 8 }
  }, function (err) {
    res.send((err === null) ? {
      msg: ''
    } : {
      msg: 'error ' + err
    });
  });
});

/* PUT to update animalid */
router.put('/updateanimal/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('animals');
  
  if(!req.body) { return res.send(400); }
  
  collection.findById(req.params.id, (e, data) => {
    if(e) { return res.send(500, e);}

    collection.updateById(req.params.id, req.body, (err) => {
      if(err) { return res.send(500, err);}

      res.json(data);
    });
  });
});

module.exports = router;