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
router.delete('/resetdb', function (req, res) {
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

/* DELETE one document */
router.delete('/deleteanimal', function (req, res) {
  console.log('arrived at deleteanimal');
  var db = req.db;
  var collection = db.get('animals');
  var docToDelete = req.data.id;
  console.log('docToDelete = ' + docToDelete);

  collection.remove({
    'id': docToDelete
  }, function (err) {
    res.send((err === null) ? {
      msg: ''
    } : {
      msg: 'error ' + err
    });
  });
});

// PUT using Node.js MongoDB Driver API
router.put('/updateanimal/:oldid/:newid', function(req, res)  {
  var db = req.db;
  var collection = db.get('animals');
  let gammalt = req.params.oldid;
  let nytt = req.params.newid;
  
  collection.update({id: gammalt }, {$set: {id: nytt}},
     function (err, result) {
    res.send(
      (err === null) ? {
        msg: ''
      } : {
        msg: err
      }
    );
  });
});

module.exports = router;