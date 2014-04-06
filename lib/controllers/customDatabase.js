/* global require, module */
var MongoClient = require('mongodb').MongoClient

/**
 * List all collections in database
 */
module.exports.listCollections = function(req, res) {
  var database = req.params.database;
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.collections(function(err, collections){
      if(err) {
        return res.send(500, err);
      };
      console.log(collections)
      return res.send(200, collections);
    });
  });
};

/**
 * Show collection
 */
module.exports.showCollection = function(req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      };
      console.log(collection)
      return res.send(200, collection);
    });
  });
};

/**
 * Create collection
 */
module.exports.createCollection = function(req, res) {
  var database = req.params.database;
  var collection = req.body.collectionName
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.createCollection(collection, function(err, collection){
      if(err) {
        return res.send(500, err);
      }
      console.log('Collection created');
      return res.send(201, collection);
    });
  });
};

/**
 * Delete collection
 */
module.exports.deleteCollection = function(req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.dropCollection(collection, function(err){
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
module.exports.renameCollection = function(req, res) {
  var database = req.params.database;
  var oldName = req.params.collection;
  var newName = req.body.newName
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.renameCollection(oldName, newName, function(err, collection){
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
module.exports.listDocuments = function(req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.find().toArray(function(err, documents) {
        if(err) {
          return res.send(500, err);
        }
        console.log(items);
        return res.send(200, documents);
      }      
    }
  });
};

/**
 * Delete all documents in collection
 */
module.exports.deleteDocuments = function(req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.remove()
      console.log('All documents in collection removed');
      return res.send(204);    
    }
  });
};

/**
 * Batch update documents in collection
 */
module.exports.updateBatch = function(req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  var where = req.body.where;
  var set = req.body.set;
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.update(where, set, {w: 1. multi: true}, function(err, count){
        if(err) {
          return res.send(500, err);
        }
        console.log(count + ' documents updated');
        return res.send(201, count);
      })
    }
  });
};

/**
 * Batch delete documents in collection
 */
module.exports.deleteBatch = function(req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  var where = req.body.where;
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.remove(where, function(err, count){
        if(err) {
          return res.send(500, err);
        }
        console.log(count + ' documents deleted');
        return res.send(204);
      })
    }
  });
};

/**
 * Show document
 */
module.exports.showDocument = function(req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  var id = req.params.id;
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.findOne({_id: id}, function(err, doc){
        if(err) {
          return res.send(500, err);
        }
        console.log(doc);
        return res.send(200, doc);
      })
    }
  });
};

/**
 * Create document(s)
 */
module.exports.createDocument = function(req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  var documents = req.post.documents;
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.insert(documents, {w:1}, function(err, documents) {
        console.log("Document(s) created");
        return res.send(201, documents);
      })
    }
  });
};

/**
 * Delete document
 */
module.exports.deleteDocument = function(req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  var id = req.params.id;
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.remove({_id: id}}, function(err, count){
        if(err) {
          return res.send(500, err);
        }
        console.log(count + ' document deleted');
        return res.send(204);
      })
    }
  });
};

/**
 * Update document
 */
module.exports.updateDocument = function(req, res) {
  var database = req.params.database;
  var collection = req.params.collection;
  var id = req.params.id;
  var set = reg.body.set;
  MongoClient.connect('mongodb://localhost:9000/'+database, function(err, db){
    if(err) {
      return res.send(500, err);
    };
    db.collection(collection, function(err, collection) {
      if(err) {
        return res.send(500, err);
      }
      collection.update({_id: id}, set, {w: 1. multi: true}, function(err, count){
        if(err) {
          return res.send(500, err);
        }
        console.log(count + ' document updated');
        return res.send(201, count);
      })
    }
  });
};

