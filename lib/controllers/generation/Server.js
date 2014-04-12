/* global require, module*/

var express = require('express');
var mongoose = require('mongoose');
var ControllerSet = require('./ControllerSet.js');
var routesMixin = require('./routesMixin.js');
var createSchema = require('./createSchema.js');
var Sockets = require('./createSocket');
/*
  bootstrap and start a server from a json file
*/

var Server = function (serverConfig) {
  //setting up promise
  this.thenQueue = [];
  this.running = false;
  //init
  this.schemas = [];
  this.serverConfig = serverConfig;
  this.serverConfig.save();
  this
    .initDB(serverConfig)
    .updateSchema(serverConfig.resources)
    .initHandlers(serverConfig)
  ;
};

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

Server.prototype.initDB = function(serverConfig){
  this.then(function(next){
    var server = this;
    console.log('++++++ trying to open db ', serverConfig.name);

    this.db = mongoose.createConnection(
      'mongodb://localhost/' + serverConfig.name,
      { db: { safe:true } });

    this.db.once('open', function(){
      console.log('++++++ database connection opened ', serverConfig.name);
      server.next();
    });
  });
  return this;
};

Server.prototype.initHandlers = function(serverConfig){
  this.then(function(){
    //controllers
    this.controllers = new ControllerSet(this, this.db);
    //server
    this.app = express();
    //middlewares
    this.app.use(express.bodyParser());
    //load sockets server
    this.io = new Sockets(this.db, this.controllers);
    routesMixin(this.app, this.controllers);
    this.next();
  });
  return this;
};

Server.prototype.updateSchema = function(resources){
  this.then(function(){
    for (var resourceName in resources){
      var resource = resources[resourceName];
      if (this.schemas[resourceName]){
        //existing resource
        for (var attribute in resource.attributes){
          if (!resource.attributes.hasOwnProperty(attribute)){
            this.schemas[resourceName].add(resource.attributes[attribute]);
          }
        }
      } else {
        //new resource
        this.serverConfig.resources[resourceName] = resources[resourceName];
        this.schemas[resourceName] = new mongoose.Schema(resource.attributes);
        this.schemas[resourceName].virtual('id').get(function(){
          return this._id;
        });
        console.log('@@@@@@ making model', resourceName);
        this.db.model(resourceName, this.schemas[resourceName]);
      }
    }
    this.serverConfig.save();
    this.next();
  });
  return this;
};

Server.prototype.start = function(port){
  console.log('++++++ SERVER START FUNCTION +++++++');
  this.then(function(){
    if (this.serverConfig.status.port){
      console.log('++++++ Server already has a port', this.serverConfig.status.port);
      return this.next();
    }

    this.serverConfig.status.port = port;
    this.serverConfig.save();
    this.started = this.app.listen(port, function () {
      console.log('++++++ Started server on', port);
    });

    this.io.listen(this.started);
    this.next();
  });
  return this;
};

Server.prototype.stop = function (next) {
  console.log('------ SERVER STOP FUNCTION ------');
  this.then(function(){
    if (!this.serverConfig.status.port){
      console.log('------ Server has no port', this.serverConfig.status);
      return this.next();
    }
    var server = this;
    this.started.close(function(){
      server.serverConfig.status.port = 0;
      console.log(server.serverConfig.status);
      server.serverConfig.save();
      console.log('------ Express server stopped', server.serverConfig.status);
    });
    this.next();
  });
  return this;
};

module.exports = Server;
