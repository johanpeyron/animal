var express = require('express');
var router = express.Router();

/* GET animals */
router.get('/', (req, res) => {
  var db = req.db;
  var collection = db.get('animals');
  collection.find({}, {}, (e, docs) => {
    res.json(docs);
  });
});

module.exports = router;