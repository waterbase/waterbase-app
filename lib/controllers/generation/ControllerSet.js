/* global module */
var statusCodes = {
  ok: 200,
  created: 201,
  finished: 204,
  notFound: 404,
  error: 500
};

module.exports = function (serverConfig, db) {
  this.retrieveAll = function (collectionName, callback) {
    db.model(collectionName)
      .find({})
      .exec()
      .then(callback);
  };

  this.updateAll = function (collectionName, id, callback) {
    db.model(collectionName)
      .update(req.body.where, req.body.set)
      .exec()
      .then(callback);
  };

  this.deleteAll = function (collectionName, id, callback) {
    db.model(collectionName)
      .remove()
      .exec()
      .then(callback);
  };

  //create element
  this.create = function (collectionName, id, callback) {
    var Model = db.model(collectionName);
    var model = new Model(req.body);
    model.save(function(err){
      callback(err, model);
    });
  };

  //element
  this.retrieveOne = function (collectionName, id, callback) {
    db.model(collectionName)
      .findById(id)
      .exec()
      .then(callback);
  };

  this.updateOne = function (collectionName, id, set, callback) {
    var collectionName, id = req.params.collectionName, id;
    db.model(collectionName)
      .findByIdAndUpdate(id, set)
      .exec()
      .then(callback);
  };

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
