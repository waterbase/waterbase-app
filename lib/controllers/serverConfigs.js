/* global require, module */
var mongoose = require('mongoose');
var url = require('url');
var ServerConfig = mongoose.model('ServerConfig');
var serversManager = require('./serversManager.js');

/**
 * List servers
 */
module.exports.list = function (req, res) {
  var user = JSON.parse(req.cookie('user'));

  ServerConfig.find({
    user: user.username
  }, function (err, serverConfig) {
    res.json(serverConfig);
  });
};

/**
 *  Get profile of specified server
 */
module.exports.show = function (req, res, next) {
  var user = JSON.parse(req.cookie('user'));
  var serverName = req.params.name;

  ServerConfig.find({
    name: serverName,
    user: user.username
  }, function (err, serverConfig) {
    if (err) return next(err);
    if (!serverConfig) return res.send(404);
    res.send(serverConfig);
  });
};

/**
 * Create, remove and update server config file
 */

//create should save the config
//and tell the manager to start a new server
//using the config
module.exports.create = function (req, res) {
  var user = JSON.parse(req.cookie('user'));
  var config = req.body;
  config.user = user.username;
  var serverConfig = new ServerConfig(config);

  serverConfig.save(function(err) {
    if (err) return res.json(400, err);
    serversManager.startServer(serverConfig);
    return res.send(204);
  });
};

//find and tell the manager to stop the server,
//and remove the config from the database
module.exports.remove = function(req, res){
  var user = JSON.parse(req.cookie('user'));
  var serverName = req.params.name;

  ServerConfig.find({
    name: serverName,
    user: user.username
  }, function (err, serverConfig) {
    serversManager.stopServer(serverConfig);
    serverConfig.remove();
    return res.send(204);
  });
};

//update the server config file
//and tell the manager to update the server's db schema
module.exports.update = function(req, res){
  var user = JSON.parse(req.cookie('user'));
  var config = req.body;
  config.user = user.username;
  var serverConfig = new ServerConfig(config);

  serverConfig.save(function(err) {
    if (err) return res.json(400, err);
    serversManager.updateServer(serverConfig);
    return res.send(204);
  });
};


//find the config and tell manager to start the server
module.exports.start = function(req, res){
  var user = JSON.parse(req.cookie('user'));
  var serverName = req.params.name;

  ServerConfig.Config.find({
    name: serverName,
    user: user.username
  }, function (err, serverConfig) {
    serversManager.startServer(serverConfig);
    res.send(204);
  });
};

//find the config and tell manager to stop the server
module.exports.stop = function(req, res){
  var user = JSON.parse(req.cookie('user'));
  var serverName = req.params.name;

  ServerConfig.find({
    name: serverName,
    user: user.username
  }, function (err, serverConfig) {
    serversManager.stopServer(serverConfig);
    res.send(204);
  });
};
