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
  //db
  this.db = mongoose.createConnection(
    'mongodb://localhost/' + serverConfig.name,
    { db: { safe:true } }
  );
  this.updateConfig(serverConfig);
  //controllers
  this.controllers = new ControllerSet(this.db);
  //server
  this.app = express();
  //middlewares
  this.app.use(express.bodyParser());
  //load sockets server
  this.io = new Sockets(this.db, this.controllers);
  this.init();
};

Server.prototype.init = function(){
  //configure api
  routesMixin(this.app, this.controllers);
};

Server.prototype.updateConfig = function(serverConfig){
  //update config
  this.serverConfig = serverConfig;
  var resources = this.serverConfig.resources;
  //update schema
  for (var resource in resources){
    createSchema(resource, resources[resource], this.db);
  }
};

Server.prototype.start = function(){
  console.log('starting', this.serverConfig);
  var started = this.app.listen(this.serverConfig.port, function () {
    console.log('Express server listening on port %d', this.serverConfig.port);
  });

  this.io.listen(started);
};

Server.prototype.stop = function () {
  this.app.stop();
};

module.exports = Server;

