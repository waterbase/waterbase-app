var ControllerSet = require('./ControllerSet.js');
var socketServer = require('socket.io');

var Sockets = module.exports = function (db, controllers) {
  this.controllers = controllers || new ControllerSet(db);
};

Sockets.prototype.listen = function(expressServer) {
  this.io = new socketServer(expressServer);

  this.init();
};

Sockets.prototype.init = function() {
  var context = this;

  this.io.on('connection', function (conn) {
    console.log('connection opened');
    conn.on('list', function () {
      context.list.apply(context, arguments);
    });
    conn.on('show', function () {
      context.show.apply(context, arguments);
    });
    conn.on('create', function () {
      context.create.apply(context, arguments);
    });
    conn.on('update', function () {
      context.update.apply(context, arguments);
    });
    conn.on('delete', function () {
      context.delete.apply(context, arguments);
    });

    conn.on('close', function () {
      console.log('connection closed');
    });
  });
};

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

//TODO
Sockets.prototype.update = function(collectionName) {

};

//Should we add a batch delete?
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