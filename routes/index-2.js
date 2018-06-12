var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index-2', { title: 'Funka' });
});

console.log('leaving route index-2');

module.exports = router;
