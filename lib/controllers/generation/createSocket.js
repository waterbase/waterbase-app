/**
 * Module Dependencies
 */

var ControllerSet = require('./ControllerSet.js');
var socketServer = require('socket.io');

/**
 * Socket Constructor
 *
 * @param {db} Database for sockets server
 * @param {controllers} Controllers to handle socket requests
 */

var Socket = module.exports = function (db, controllers) {
  this.controllers = controllers || new ControllerSet(db);
};

/**
 * Initiate Connection and Initialize Event Listeners
 *
 * @param {expressServer} Server to attach socket
 */

Socket.prototype.listen = function(expressServer) {
  this.io = socketServer.listen(expressServer);

  this.init();
};

// Initializes Socket Server
Socket.prototype.init = function() {
  var context = this;

  this.io.sockets.on('connection', function (conn) {
    console.log('connection opened');

    // Collection Event Listeners
    // Get all documents
    conn.on('retrieveAll', function () {
      context.retrieveAll.apply(context, arguments);
    });
    // Document
    conn.on('retrieveOne', function () {
      context.retrieveOne.apply(context, arguments);
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
    conn.on('deleteAll', function () {
      context.deleteAll.apply(context, arguments);
    });

    // Model Event Listeners
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
   * Broadcasts global event to all clients
   *
   * @param {Event} Specify event type
   * @param {Object} data regarding event
   */

  Socket.prototype.broadcast = function(event, data) {
    this.io.sockets.emit('broadcast', event, data);
  };

  /**
   * Handles data from controller and broadcasts updates
   * to all other clients
   *
   * @param {callback} Callback to use retrieved data
   * @param {event} Event to be broadcasted to clients
   */

  Socket.prototype.handleRequest = function(callback, event) {
    var context = this;

    return function (err, data) {
      callback(err, data);

      if (event) {
        var results = [];
        context.broadcast(event, results.concat(data));
      }
    };
  };

/**
 * Delegate Events to ControllerSet
 */

Socket.prototype.retrieveAll = function(collectionName, callback) {
  this.controllers.retrieveAll(
    collectionName,
    this.handleRequest(callback)
  );
};

Socket.prototype.retrieveOne = function(collectionName, id, callback) {
  this.controllers.retrieveOne(
    collectionName,
    id,
    this.handleRequest(callback)
  );
};

Socket.prototype.create = function(collectionName, set, callback) {
  this.controllers.create(
    collectionName,
    set,
    this.handleRequest(callback, 'create')
  );
};

Socket.prototype.update = function(collectionName, where, set, callback) {
  this.controllers.updateAll(
    collectionName,
    where,
    set,
    this.handleRequest(callback, 'update')
  );
};

Socket.prototype.deleteAll = function(collectionName, callback) {
  this.controllers.deleteAll(
    collectionName,
    this.handleRequest(callback, 'deleteAll')
  );
};

Socket.prototype.updateOne = function(collectionName, id, set, callback) {
  this.controllers.updateOne(
    collectionName,
    id,
    set,
    this.handleRequest(callback, 'update')
  );
};

Socket.prototype.deleteOne = function(collectionName, id, callback) {
  this.controllers.deleteOne(
    collectionName,
    id,
    this.handleRequest(callback, 'deleteOne')
  );
};
