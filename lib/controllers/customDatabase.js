'use strict';

/* global require, module */
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var ServerConfig = mongoose.model('ServerConfig');

var getDatabaseUri = function (serverId, callback) {
  console.log('===== START: Custom Database');
  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) return console.error(err);
    console.log('===== SUCCESS: Got ServerConfig');
    callback(serverConfig);
  });
};

/**
 * List all collections in database
 */
exports.listCollections = function (req, res) {
  var serverId = req.params.id;

  getDatabaseUri(serverId, function (serverConfig) {
    MongoClient.connect(serverConfig.databaseUri, function (err, db) {
      if(err) return res.send(500, err);

      db.collectionNames(function (err, collections) {
        if(err) return res.send(500, err);

        db.close();
        return res.json(collections);
      });
    });

  });

};

/**
 * List all documents in collection
 */
exports.listDocuments = function (req, res) {
  var serverId = req.params.id;
  var collection = req.params.collection;

  getDatabaseUri(serverId, function (serverConfig) {
    MongoClient.connect(serverConfig.databaseUri, function(err, db) {
      if(err) return res.send(500, err);

      db.collection(collection, function (err, collection) {
        if(err) return res.send(500, err);

        collection.find().toArray(function (err, documents) {
          if(err) return res.send(500, err);

          db.close();
          res.send(200, documents);
        });
      });
    });
  });
};

/**
 * Create document(s)
 */
exports.createDocument = function (req, res) {
  var serverId = req.params.id;
  var collection = req.params.collection;
  var doc = req.body;

  getDatabaseUri(serverId, function (serverConfig) {
    MongoClient.connect(serverConfig.databaseUri, function(err, db){
      if(err) {
        console.log(err);
        return res.send(500, err);
      }
      db.collection(collection, function(err, collection) {
        if(err) {
          return res.send(500, err);
        }
        collection.insert(doc, {w:1}, function(err) {
          return res.send(201);
        });
      });
    });
  });
};

/**
 * Delete document
 */
exports.deleteDocument = function (req, res) {
  var serverId = req.params.id;
  var collection = req.params.collection;
  var documentId = new ObjectID(req.params.documentId);

  getDatabaseUri(serverId, function (serverConfig) {
    MongoClient.connect(serverConfig.databaseUri, function(err, db){
      if(err) return res.send(500, err);

      db.collection(collection, function(err, collection) {
        if(err) return res.send(500, err);

        collection.remove({_id : documentId}, function(err, count){
          if(err) return res.send(500, err);

          db.close();
          return res.send(204);
        });
      });
    });
  });
};

/**
 * Update document
 */
exports.updateDocument = function (req, res) {
  var serverId = req.params.id;
  var collection = req.params.collection;
  var documentId = new ObjectID(req.params.documentId);
  var doc = req.body;

  getDatabaseUri(serverId, function (serverConfig) {

    MongoClient.connect(serverConfig.databaseUri, function(err, db){
      if(err) return res.send(500, err);

      db.collection(collection, function(err, collection) {
        if(err) return res.send(500, err);

        collection.update({_id: documentId}, doc , {w: 1}, function(err, count){
          if(err) return res.send(500, err);

          db.close();
          return res.send(200);
        });
      });
    });
  });
};

