const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://rubert:martijn@ds125938.mlab.com:25938/todoapp', (err, client) => {
  if(err) {
    return console.log(err);
  } 
  console.log('connected to database', client);
  
  const db = client.db('todoapp');
  console.log(db);
  
//   db.collection('todos').insertOne({
//     text: 'some text',
//     completed: false
//   }, (err, result) => {
//     if(err) {
//       return console.log('Unable to insert todo', err);
//     }
//     console.log(Jcd ..SON.stringify(result.ops, undefined, 2));
//   });
  
 insertDocuments(db, function() {
    client.close();
  });
});

const insertDocuments = function(db, callback) {
  const collection = db.collection('todos');
  collection.insertOne({
    text: 'some text',
    completed: false
  }, function(err, result) {
    console.log("Inserted 1 document into the collection");
    callback(result);
  });
}
