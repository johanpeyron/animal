var express = require('express');
var router = express.Router();
var path = require('path');

startPg = path.join(__dirname, '../', 'index.html');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(startPg);
});

module.exports = router;
