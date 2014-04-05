/* global module */
var statusCodes = {
  ok: 200,
  created: 201,
  finished: 204,
  notFound: 404,
  error: 500
};

module.exports = function (db) {
  //get all documents
  this.retrieveAll = function (collectionName, callback) {
    db.model(collectionName)
      .find({})
      .exec()
      .then(callback);
  };

  //update all documents
  this.updateAll = function (collectionName, where, set, callback) {
    db.model(collectionName)
      .update(where, set)
      .exec()
      .then(callback);
  };

  //delete all documents
  this.deleteAll = function (collectionName, callback) {
    db.model(collectionName)
      .remove()
      .exec()
      .then(callback);
  };

  //create document
  this.create = function (collectionName, set, callback) {
    var Model = db.model(collectionName);
    var model = new Model(set);
    model.save(function(err){
      callback(err, model);
    });
  };

  //document
  this.retrieveOne = function (collectionName, id, callback) {
    db.model(collectionName)
      .findById(id)
      .exec()
      .then(callback);
  };

  //update single document
  this.updateOne = function (collectionName, id, set, callback) {
    db.model(collectionName)
      .findByIdAndUpdate(id, set)
      .exec()
      .then(callback);
  };

  //delete single document
  this.deleteOne = function (collectionName, id, callback) {
    db.model(collectionName)
      .findById(id)
      .exec()
      .then(function (err, data) {
        if (err || !data) {
          callback(err, data);
        }
        data
          .remove()
          .exec()
          .then(function(err){
            callback(err, data);
          });
      });
  };
};
