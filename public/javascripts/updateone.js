var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/animalDB";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("animalDB");
  var myquery = { id: "9" };
  var newvalues = { $set: { id: "10" } };
  dbo.collection("animals").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });
});

module.exports = mongofetch;