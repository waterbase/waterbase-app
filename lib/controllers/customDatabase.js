'use strict';

/* global require, module */
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var uri = 'mongodb://localhost/';

/**
 * List all collections in database
 */
exports.listCollections = function (req, res) {
  var database = req.params.database;
  MongoClient.connect(uri+database, function (err, db) {
    if(err) {
      console.log('failed to connect');
      console.log(err);
      return res.send(500, err);
    }
    db.collectionNames(function (err, collections) {
      if(err) {
        console.log(err);
        return res.send(500, err);
      }
      console.log(collections);
      db.close();
      return res.json(collections);
    });
  });
};

// /**
//  * Show collection
//  */
// exports.showCollection = function (req, res) {
//   var database = req.params.database;
//   var collection = req.params.collection;
//   MongoClient.connect(uri+database, function (err, db) {
//     if(err) {
//       return res.send(500, err);
//     }
//     db.collection(collection, function (err, collection) {
//       if(err) {
//         return res.send(500, err);
//       }
//       console.log(collection);
//       return res.send(200, collection);
//     });
//   });
// };

// /**
//  * Create collection
//  */
// exports.createCollection = function (req, res) {
//   var database = req.params.database;
//   var collection = req.body.collectionName;
//   MongoClient.connect(uri+database, function (err, db) {
//     if(err) {
//       return res.send(500, err);
//     }
//     db.createCollection(collection, function (err, collection){
//       if(err) {
//         return res.send(500, err);
//       }
//       console.log('Collection created');
//       return res.send(201, collection);
//     });
//   });
// };

/**
 * Delete collection
 */
exports.deleteCollection = function (req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  MongoClient.connect(uri+database, function (err, db) {
    if(err) {
      return res.send(500, err);
    }
    db.dropCollection(collection, function (err){
      if(err) {
        return res.send(500, err);
      }
      console.log('Collection deleted');
      return res.send(204);
    });
  });
};

/**
 * Rename collection
 */
exports.renameCollection = function (req, res) {
  var database = req.params.database;
  var oldName = req.params.collection;
  var newName = req.body.newName;
  console.log(oldName);
  console.log(req.body);
  MongoClient.connect(uri+database, function (err, db) {
    if(err) {
      return res.send(500, err);
    }
    db.renameCollection(oldName, newName, function (err, collection){
      if(err) {
        return res.send(500, err);
      }
      console.log('Collection renamed');
      return res.send(201, collection);
    });
  });
};

/**
 * List all documents in collection
 */
exports.listDocuments = function (req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  MongoClient.connect(uri+database, function(err, db) {
    if(err) {
      return res.send(500, err);
    }
    db.collection(collection, function (err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.find().toArray(function (err, documents) {
        if(err) {
          return res.send(500, err);
        }
        console.log(documents);
        return res.send(200, documents);
      });
    });
  });
};

/**
 * Delete all documents in collection
 */
exports.deleteDocuments = function (req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  MongoClient.connect(uri+database, function (err, db) {
    if(err) {
      return res.send(500, err);
    }
    db.collection(collection, function (err, collection) {
      if(err) {
        return res.send(500, err);
      }
      console.log(collection);
      collection.remove();
      console.log('All documents in collection removed');
      return res.send(204);
    });
  });
};

// /**
//  * Batch update documents in collection
//  */
// exports.updateBatch = function (req, res) {
//   var database = req.params.database;
//   var collection = req.params.collection;
//   var where = req.body.where;
//   var set = req.body.set;
//   MongoClient.connect(uri+database, function (err, db){
//     if(err) {
//       return res.send(500, err);
//     }
//     db.collection(collection, function(err, collection) {
//       if(err) {
//         return res.send(500, err);
//       }
//       collection.update(where, set, {w: 1, multi: true}, function (err, count){
//         if(err) {
//           return res.send(500, err);
//         }
//         console.log(count + ' documents updated');
//         return res.send(201, count);
//       });
//     });
//   });
// };

// /**
//  * Batch delete documents in collection
//  */
// exports.deleteBatch = function (req, res) {
//   var database = req.params.database;
//   var collection = req.params.collection;
//   var where = req.body.where;
//   MongoClient.connect(uri+database, function(err, db){
//     if(err) {
//       return res.send(500, err);
//     }
//     db.collection(collection, function(err, collection) {
//       if(err) {
//         return res.send(500, err);
//       }
//       collection.remove(where, function(err, count){
//         if(err) {
//           return res.send(500, err);
//         }
//         console.log(count + ' documents deleted');
//         return res.send(204);
//       });
//     });
//   });
// };

// /**
//  * Show document
//  */
// exports.showDocument = function (req, res) {
//   var database = req.params.database;
//   var collection = req.params.collection;
//   var id = req.params.id;
//   MongoClient.connect(uri+database, function(err, db){
//     if(err) {
//       return res.send(500, err);
//     }
//     db.collection(collection, function(err, collection) {
//       if(err) {
//         return res.send(500, err);
//       }
//       collection.findOne({_id: id}, function(err, doc){
//         if(err) {
//           return res.send(500, err);
//         }
//         console.log(doc);
//         return res.send(200, doc);
//       });
//     });
//   });
// };

/**
 * Create document(s)
 */
exports.createDocument = function (req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  var documents = req.body.documents;
  MongoClient.connect(uri+database, function(err, db){
    if(err) {
      return res.send(500, err);
    }
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.insert(documents, {w:1}, function(err, documents) {
        console.log("Document(s) created");
        return res.send(201, documents);
      });
    });
  });
};

/**
 * Delete document
 */
exports.deleteDocument = function (req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  var id = new ObjectID(req.params.id);
  MongoClient.connect(uri+database, function(err, db){
    if(err) {
      return res.send(500, err);
    }
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.remove({_id : id}, function(err, count){
        if(err) {
          return res.send(500, err);
        }
        console.log(count + ' document deleted');
        db.close();
        return res.send(204);
      });
    });
  });
};

/**
 * Update document
 */
exports.updateDocument = function (req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  var id = new ObjectID(req.params.id);
  var doc = req.body;
  console.log("THIS IS THE SET: ", doc);
  MongoClient.connect(uri+database, function(err, db){
    if(err) {
      console.log('did not connect to database');
      return res.send(500, err);
    }
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.update({_id: id}, doc , {w: 1}, function(err, count){
        if(err) {
          return res.send(500, err);
        }
        console.log('document updated');
        db.close();
        return res.send(200);
      });
    });
  });
};

