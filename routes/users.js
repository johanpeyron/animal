var express = require('express');
var router = express.Router();

/* GET userlist */
router.get('/userlist', (req, res) => {
  var db = req.db;
  var collection = db.get('userlist');
  collection.find({}, {}, (e, docs) => {
    res.json(docs);
  });
});

/* POST to adduser */
router.post('/adduser', function (req, res) {
  var db = req.db;
  var collection = db.get('userlist');
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

/* DELETE to deletuser */
router.delete('/deleteuser/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('userlist');
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

/* PUT to updateuser */
/* -------------------------------------------------------------------------------------------------------------------+
|  Example found at                                                                                                   |
|  https://stackoverflow.com/questions/25408243/trouble-with-put-request-using-node-js-express-angular-and-mongodb    |
|                                                                                                                     |
|  Notes:                                                                                                             |
|  1. When running in an error always use return                                                                      |
|  2. Always send a status back. In this case we'll send 500                                                          |
|  3. Check for not found and return 404                                                                              |
|  4. Use simple update object. This will only update fields contained in the update object                           |
|  5. The mongodb document returned by monk has no save function, the document needs to be updated via the collection |
|  6. Check if the request has a body and send 400 - Bad Request                                                      |
|                                                                                                                     |
|  You can pass a object id as hex or ObjectId to findById as stated in the Monk docs.                                |
+---------------------------------------------------------------------------------------------------------------------+

router.put('/api/habits/:habit_id', function(req, rest){
    var db = req.db;
    var collection = db.get('habits');

    if(!req.body) { return res.send(400); } // 6

    collection.findById(req.params.habit_id, function(e,data){
        if(e) { return res.send(500, e); } // 1, 2

        if(!data) { return res.send(404); } // 3

        var update = { title : req.body.title, count : req.body.count }; // 4

        collection.updateById(req.params.habit_id, update, function(err) { // 5
            if(err) {
                return res.send(500, err);
            }

            res.json(data);
        });
    });
}); */

router.put('/updateuser/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  
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