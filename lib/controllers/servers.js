'use strict';

var mongoose = require('mongoose'),
    url = require('url'),
    Server = mongoose.model('Server'),
    Util = require('./utils');

/**
 * List servers
 */

exports.list = function (req, res, next) {
  var user = JSON.parse(req.cookie('user'));

  Server.find({
    user: user.username
  }, function (err, server) {
    res.json(server);
  });
};

/**
 *  Get profile of specified server
 */
exports.show = function (req, res, next) {
  var user = JSON.parse(req.cookie('user'));
  var serverName = req.params.name;

  Server.find({
    name: serverName,
    user: user.username
  }, function (err, server) {
    if (err) return next(err);
    if (!server) return res.send(404);
    console.log('created');
    res.send(server);
  });
};

/**
 * Create server
 */
exports.create = function (req, res, next) {
  var user = JSON.parse(req.cookie('user'));
  var config = req.body;
  config.user = user.username;
  var newServer = new Server(config);

  newServer.save(function(err) {
    if (err) return res.json(400, err);

    Util.startServer(newServer);

    return res.json(newServer);
  });
};

exports.update = function(req, res, next){
  var newServer = new Server(req.body);

  newServer.save(function(err) {
    if (err) return res.json(400, err);

    Util.startServer(newServer);

    return res.json(newServer);
  });
}

exports.remove = function(req, res, next){
  var user = JSON.parse(req.cookie('user'));
  var serverName = req.params.name;

  Server.find({
    name: serverName,
    user: user.username
  }, function (err, server) {
    Util.stopServer(server);
    server.remove();
  });
}

exports.start = function(req, res, next){
  var user = JSON.parse(req.cookie('user'));
  var serverName = req.params.name;

  Server.find({
    name: serverName,
    user: user.username
  }, function (err, server) {
    Util.startServer(server);
  });
}

exports.stop = function(req, res, next){
  var user = JSON.parse(req.cookie('user'));
  var serverName = req.params.name;

  Server.find({
    name: serverName,
    user: user.username
  }, function (err, server) {
    Util.stopServer(server);
  });
}
