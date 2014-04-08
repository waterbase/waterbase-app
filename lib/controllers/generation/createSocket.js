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
  this.io = new socketServer(expressServer);

  this.init();
};

// Initializes Socket Server
Socket.prototype.init = function() {
  var context = this;

  this.io.on('connection', function (conn) {
    console.log('connection opened');

    // Collection Event Listeners
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
 * Handles data from controller and broadcasts updates
 * to all other clients
 *
 * @param {Event} Specify event type
 * @param {Object} data regarding event
 */

var handleRequest = function(callback, event) {
  return function (err, data) {
    callback(err, data);

    if (event) this.broadcast(event, data);
  };
};

/**
 * Delegate Events to ControllerSet
 */

Socket.prototype.list = function(collectionName, callback) {
  this.controllers.retrieveAll(
    collectionName,
    handleRequest(callback)
  );
};

Socket.prototype.show = function(collectionName, id, callback) {
  this.controllers.retrieveOne(
    collectionName,
    id,
    handleRequest(callback)
  );
};

Socket.prototype.create = function(collectionName, set, callback) {
  this.controllers.create(
    collectionName,
    set,
    handleRequest(callback, 'create')
  );
};

Socket.prototype.update = function(collectionName, where, set, callback) {
  this.controllers.updateAll(
    collectionName,
    where,
    set,
    handleRequest(callback, 'update')
  );
};

Socket.prototype.delete = function(collectionName, callback) {
  this.controllers.delete(
    collectionName,
    handleRequest(callback, 'delete')
  );
};

Socket.prototype.updateOne = function(collectionName, id, set, callback) {
  this.controllers.updateOne(
    collectionName,
    id,
    set,
    handleRequest(callback, 'updateOne')
  );
};

Socket.prototype.deleteOne = function(collectionName, id, callback) {
  this.controllers.deleteOne(
    collectionName,
    id,
    handleRequest(callback, 'deleteOne')
  );
};

/**
 * Broadcasts global event to all clients
 *
 * @param {Event} Specify event type
 * @param {Object} data regarding event
 */

Socket.prototype.broadcast = function(event, data) {
  this.io.broadcast.emit('broadcast', event, data);
};
