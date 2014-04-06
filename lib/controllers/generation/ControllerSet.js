/* global require, module */
var request = require('request');
var createSchema = require('./createSchema.js');
var statusCodes = {
  ok: 200,
  created: 201,
  finished: 204,
  notFound: 404,
  error: 500
};

/*
dynamic schema change
if a schema changes 

how to link back to serverConfig file?
*/

module.exports = function (serverConfig, db) {
  var convertToSchema = function(data, names){
    var schema = {};
    for (var key in data){
      var type = Array.isArray(data[key])? 'arrayy' : typeof data[key];
      if (type === 'object'){
        //if a field is non-array object, 
        //see if it can be a reference field
        if (names.indexOf(key) !== -1){
          type = {
            type: Schema.Types.ObjectOd,
            ref: key
          };
        } else {
          //otherwise give it a free-form type
          type: {};
        }
      } else {
        schema[key] = type.charAt(0).toUpperCase() + type.slice(1);
      }
    }
    return schema;
  }

  var createIfNotExist = function(collectionName, data, callback){
    db.collectionNames(function(err, names){
      var schema = convertToSchema(data, names);
      if (err){
        callback(err);
      }
      if (names.indexOf(collectionName) !== -1){
        callback();
      }
      //create the schema in database
      createSchema(collectionName, def, db)
      //update the serverConfig file
      serverConfig.resources.push(schema);
    })
  };

  this.retrieveAll = function (collectionName, callback) {
    createIfNotExist(collectionName, {}, function(err){
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .find({})
        .exec()
        .then(callback);
    }
  };

  this.updateAll = function (collectionName, id, where, set callback) {
    createIfNotExist(collectionName, set, function(err){
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .update(where, set)
        .exec()
        .then(callback);
    });
  };

  this.deleteAll = function (collectionName, id, callback) {
    createIfNotExist(collectionName, {}, function(err){
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .remove()
        .exec()
        .then(callback);
    })
  };

  //create element
  this.create = function (collectionName, id, data, callback) {
    createIfNotExist(collectionName, data, function(err){
      if (err){
        callback(err);
      }
      var Model = db.model(collectionName);
      var model = new Model(data);
      model.save(function(err){
        callback(err, model);
      });
    });
  };

  //document
  this.retrieveOne = function (collectionName, id, callback) {
    createIfNotExist(collectionName, {}, function(err){
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .findById(id)
        .exec()
        .then(callback);
    });
  };

  //update single document
  this.updateOne = function (collectionName, id, set, callback) {
    createIfNotExist(collectionName, set, function(err){
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .findByIdAndUpdate(id, set)
        .exec()
        .then(callback);
    });
  };

  //delete single document
  this.deleteOne = function (collectionName, id, callback) {
    createIfNotExist(collectionName, {}, function(err){
      if (err){
        callback(err);
      }
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
    });
  };
};
