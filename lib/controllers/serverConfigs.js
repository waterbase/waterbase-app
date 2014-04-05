/* global require, module */
var mongoose = require('mongoose');
var ServerConfig = mongoose.model('ServerConfig');
var serversManager = require('./serversManager.js');

/**
 * List servers
 */
module.exports.list = function (req, res) {
  console.log('server list');
  var user = req.user;
  console.log(user);
  ServerConfig.find({
    user: user._id
  }, function (err, serverConfig) {
    if (err) {
      return res.send(500, err);
    }
    res.json(serverConfig);
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
    if (err) {
      return res.send(500, err);
    }
    serversManager.startServer(serverConfig);
    return res.send(204);
  });
};

/**
 *  Get profile of specified server
 */
module.exports.show = function (req, res) {
  var user = JSON.parse(req.cookie('user'));
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) {
      return res.send(500, err);
    } else if (!serverConfig) {
      return res.send(404);
    } else if (user !== serverConfig.username) {
      return res.send(401);
    }

    res.send(200, serverConfig);
  });
};

//find and tell the manager to stop the server,
//and remove the config from the database
module.exports.remove = function(req, res){
  var user = JSON.parse(req.cookie('user'));
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) {
      return res.send(500, err);
    } else if (!serverConfig) {
      return res.send(404);
    } else if (user !== serverConfig.username) {
      return res.send(401);
    }

    serversManager.stopServer(serverConfig);
    serverConfig.remove();
    return res.send(204);
  });
};

//update the server config file
//and tell the manager to update the server's db schema
module.exports.update = function(req, res){
  var user = JSON.parse(req.cookie('user'));
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) {
      return res.send(500, err);
    } else if (!serverConfig) {
      return res.send(404);
    } else if (user !== serverConfig.username) {
      return res.send(401);
    }

    serverConfig.resources = req.body.resources;
    serverConfig.save();
    serversManager.updateServer(serverConfig);
    return res.send(204);
  });
};


//find the config and tell manager to start the server
module.exports.start = function(req, res){
  var user = JSON.parse(req.cookie('user'));
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) {
      return res.send(500, err);
    } else if (!serverConfig) {
      return res.send(404);
    } else if (user !== serverConfig.username) {
      return res.send(401);
    }

    serversManager.startServer(serverConfig);
    res.send(204);
  });
};

//find the config and tell manager to stop the server
module.exports.stop = function(req, res){
  var user = JSON.parse(req.cookie('user'));
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) {
      return res.send(500, err);
    } else if (!serverConfig) {
      return res.send(404);
    } else if (user !== serverConfig.user) {
      return res.send(401);
    }

    serversManager.stopServer(serverConfig);
    res.send(204);
  });
};