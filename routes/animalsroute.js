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

/* https://github.com/FSojitra/Node-Express-MongoDB-REST-API-jQuery-AJAX */
router.put('/user/:id', function(req, res) {
  var id = req.params.id;
  console.log("id"+id);
  var personInfo = req.body;
  console.log()

  User.update({unique_id:id}, {
    username: personInfo.username, 
    fullname: personInfo.fullname, 
    age: personInfo.age
  }, function(err, rawResponse) {
   console.log(rawResponse);
 });

});

/* PUT to update animalid */
router.put('/updateanimal', function(req, res) {
  var db = req.db;
  var collection = db.get('animals');
  var id = req.params.id;
  var oldid = req.params.oldid;
  
  if(!req.body) { return res.send(400); }
  
/*   collection.findById(req.params.oldid, (e, data) => {
    if(e) { return res.send(501, e);} */

/*     collection.updateById(req.params.id, req.body, (err) => {
      if(err) { return res.send(502, err);}

      res.json(data);
    }); */
 // });
});

// PUT test Node.js MongoDB Driver API
router.put('/updateanimal2', function(req, res) {
  console.log(req.params.data);
  console.log(req.params);
  var db = req.db;
  var collection = db.get('animals');
  var newid = req.data.id;
  console.log(newid);
  var oldid = req.data.oldid;
  console.log(oldid);
  
  if(!req.body) { return res.send(400); }
  
  collection.update({id:oldid}, {$set: {id:newid}},
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

// PUT test Node.js MongoDB Driver API
router.put('/updateanimal3/:oldid/:newid', function(req, res)  {
  var db = req.db;
  var collection = db.get('animals');
  if (typeof req.params.oldid !== 'undefined' ) {
    console.log('req.params.oldid = ' + req.params.oldid);
  }
  if (typeof req.params.newid !== 'undefined' ) {
    console.log('req.params.newid = ' + req.params.newid);
  }
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

router.put('/updateanimal4', function(req, res) {
    var db = req.db;
    var collection = db.get('animals');

    if(!req.body) { return res.send(400); }

    collection.findById(req.body.oldid, function(e,data){
        if(e) { return res.send(500, e); }

        if(!data) { return res.send(404); }

        var update = { title : req.body.id };

        collection.updateById(req.body, update, function(err) {
            if(err) {
                return res.send(500, err);
            }

            res.json(data);
        });
    });
});

router.put('/updateanimal5', function(req, res) {
  var db = req.db;
  var collection = db.get('animals');
  var myquery = { id: "9" };
  var newvalues = { $set: {id: "10" } };


  if(!req.body) { return res.send(400); }

  collection("animals").updateOne(myquery, newvalues, function(e, data) {
      if(e) { return res.send(500, e); }
      if(!data) { return res.send(404); }
        res.json(data);
      });
  });

module.exports = router;