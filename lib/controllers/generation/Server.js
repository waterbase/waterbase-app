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
  this
    .initDB(serverConfig)
    .updateSchema(serverConfig)
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
  func.apply(this);
};

Server.prototype.initDB = function(serverConfig){
  this.then(function(){
    var server = this;
    mongoose.connect('mongodb://localhost/' + serverConfig.name, { db: { safe:true } });
    this.db = mongoose.connection;
    this.db.once('open', function(){
      console.log('+++++++++++++++opened');
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

Server.prototype.updateSchema = function(serverConfig){
  this.then(function(){
    console.log(serverConfig.resources['animals']);
    this.serverConfig = serverConfig;
    for (var key in serverConfig.resources){
      var resource = serverConfig.resources[key];
      if (this.schemas[serverConfig.name]){
        //existing resource
        for (var attribute in resource.attributes){
          if (!resource.attributes.hasOwnProperty(attribute)){
            this.schemas[serverConfig.name].add(resource.attributes[attribute]);
          }
        }
      } else {
        //new resource
        this.schemas[serverConfig.name] = new mongoose.Schema(resource);
        this.schemas[serverConfig.name].virtual('id').get(function(){
          return this._id;
        });
        this.db.model(serverConfig.name, this.schemas[serverConfig.name]);
      }
    }
    this.next();
  });
  return this;
};

Server.prototype.start = function(port){
  this.then(function(){
    this.serverConfig.status.port = port;
    console.log('++++++starting', this.serverConfig);
    this.started = this.app.listen(port, function () {
      console.log('Express server listening on port %d', port);
    });

    this.io.listen(this.started);
    this.next();
  });
  return this;
};

Server.prototype.stop = function () {
  this.then(function(){
    console.log('------stopping server on', this.serverConfig.status.port);
    delete this.serverConfig.status.port;
    this.started.close();
    this.next();
  });
  return this;
};

module.exports = Server;
