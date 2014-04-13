/* global require, module*/

var express = require('express');
var mongoose = require('mongoose');
var ControllerSet = require('./ControllerSet.js');
var middlewareMixin = require('./middlewareMixin.js');
var routesMixin = require('./routesMixin.js');
var createSchema = require('./createSchema.js');
var Socket = require('./createSocket');

/*
  bootstrap and start a server from a json file

  when the server starts, it should
  1. create a connection to its own database
  2. create models from config file on the connection
  3. create routes and sockets
  4. start listening with both express app and sockets

  when the server stops, it should
  stop listening
  close db connection

  while it is running,
  it should create new models when a new resource is requested
  it should take schema changes, and restart the server

*/

var Server = function (serverConfig) {
  //setting up promise
  this.thenQueue = [];
  this.running = false;
  //init
  this.serverConfig = serverConfig;
  this.serverConfig.save();
};

/*
  create a promise like async execution queue
*/

Server.prototype.then = function(func){
  this.thenQueue.push(func);
  if (!this.running){
    this.running = true;
    this.next();
  }
  return this;
};

Server.prototype.next = function(){
  if (this.thenQueue.length === 0){
    this.running = false;
    return;
  }
  var func = this.thenQueue.shift();
  var server = this;
  func.call(this, function(){
    server.next();
  });
};

/*
  database and models
*/

Server.prototype.createDatabaseConnection = function(){
  this.then(function(next){
    if (this.serverConfig.status.port){
      console.log(' Server oooooo Server already started on', this.serverConfig.status.port);
      return this.next();
    }

    this.databaseConnection = mongoose.createConnection(
      'mongodb://localhost/' + this.serverConfig.name,
      { db: { safe:true } });

    //when the connection opens
    var self = this;
    this.databaseConnection.once('open', function(){
      console.log(' Server ++++++ database connection opened ', self.serverConfig.name);

      //creating resources
      var resources = self.serverConfig.resources;
      for (var resourceName in resources){
        self.createResource(resourceName, resources[resourceName]);
      }

      //signal finished
      self.next();
    });
  });
  return this;
};

Server.prototype.destroyDatabaseConnection = function(){
  this.then(function(){
    if (!this.serverConfig.status.port){
      console.log(' Server oooooo Server is not started', this.serverConfig.status);
      return this.next();
    }

    this.databaseConnection.close(function(){
      console.log(' Server ------ database connection closed');
      this.next();
    });
  });
  return this;
};

/*
  app and sockets
*/

Server.prototype.listen = function(port){
  this.then(function(){
    if (this.serverConfig.status.port){
      console.log(' Server oooooo Server already started on', this.serverConfig.status.port);
      return this.next();
    }

    var controllers = new ControllerSet(this, this.databaseConnection);
    var app = express();

    //mixing in middleware and routes for the express app
    middlewareMixin(app);
    routesMixin(app, controllers);

    //load sockets
    this.io = new Socket(this.databaseConnection, controllers);

    //change the status in database
    this.serverConfig.status.port = port;
    this.serverConfig.save();

    //start listening
    this.serverInstance = app.listen(port, function () {
      console.log(' Server ++++++ Server started on', port);
    });
    this.io.listen(this.serverInstance);
    this.next();
  });
  return this;
};


Server.prototype.stopListen = function (next) {
  this.then(function(){
    if (!this.serverConfig.status.port){
      console.log(' Server oooooo Server is not started', this.serverConfig.status);
      return this.next();
    }

    //stop the server
    var server = this;
    this.serverInstance.close(function(){
      server.serverConfig.status.port = 0;
      server.serverConfig.save();
      console.log(' Server ------ Server stopped', server.serverConfig.status);
    });

    //signal finish
    this.next();
  });
  return this;
};


/*
  models exists on the connection
  so they don't need to be explicity destroyed
*/

Server.prototype.createResource = function(resourceName, resource){
  this.then(function(){
    //update serverConfig file
    this.serverConfig.resources[resourceName] = resource;

    //creating model in the server's database
    this.databaseConnection.model(resourceName, resource.attributes);

    this.serverConfig.save();
  });
  return this;
};

/*
  starting and stopping
*/
Server.prototype.start = function(port){
  return this
    .createDatabaseConnection()
    .listen(port);
};

Server.prototype.stop = function(port){
  return this
    .destroyDatabaseConnection()
    .stopListen();
};

module.exports = Server;
