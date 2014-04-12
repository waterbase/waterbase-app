/**
 * Module Dependencies
 */

var ControllerSet = require('./ControllerSet.js');

/**
 * Expose `Sockets`
 */

var Sockets = module.exports = function (db, controllers) {
  this.controllers = controllers || new ControllerSet(db);
};

/**
 * Initiate Connection and Initialize Event Listeners
 */

Sockets.prototype.listen = function(expressServer) {
  this.io = require('socket.io').listen(expressServer);

  this.init();
};

// Initialization of Sockets Server
Sockets.prototype.init = function() {
  var context = this;

  this.io.on('connection', function (conn) {
    console.log('connection opened');
    console.log(conn);

    // Collection Events
    // Get all documents
    conn.on('list', function () {
      context.list.apply(context, arguments);
    });
    // Document
    conn.on('show', function () {
      context.show.apply(context, arguments);
    });
    // Create document
    conn.on('create', function () {
      context.create.apply(context, arguments);
    });
    // Batch update documents
    conn.on('update', function () {
      context.update.apply(context, arguments);
    });
    // Delete all documents
    conn.on('delete', function () {
      context.delete.apply(context, arguments);
    });

    // Model Events
    // Update single document
    conn.on('updateOne', function () {
      context.updateOne.apply(context, arguments);
    });
    // Delete single document
    conn.on('deleteOne', function () {
      context.deleteOne.apply(context, arguments);
    });

    conn.on('close', function () {
      console.log('connection closed');
    });
  });
};

/**
 * Delegate Events to ControllerSet
 */

Sockets.prototype.list = function(collectionName, callback) {
  this.controllers.retrieveAll(collectionName,
    this.handleRequest(callback));
};

Sockets.prototype.show = function(collectionName, id, callback) {
  this.controllers.retrieveOne(collectionName,
    this.handleRequest(callback));
};

Sockets.prototype.create = function(collectionName, set, callback) {
  this.controllers.create(collectionName, set,
    this.handleRequest(callback));
};

Sockets.prototype.update = function(collectionName, where, set, callback) {
  this.controllers.update(collectionName, where, set,
    this.handleRequest(callback));
};

Sockets.prototype.delete = function(collectionName, callback) {
  this.controllers.delete(collectionName,
    this.handleRequest(callback));
};

Sockets.prototype.updateOne = function(collectionName, id, set, callback) {
  this.controllers.updateOne(collectionName, id, set,
    this.handleRequest(callback));
};

Sockets.prototype.deleteOne = function(collectionName, id, callback) {
  this.controllers.deleteOne(collectionName, id,
    this.handleRequest(callback));
};

Sockets.prototype.handleRequest = function(callback) {
  return function (err, data) {
    callback(err, data);
  };
};