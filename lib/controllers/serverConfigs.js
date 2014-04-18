/* global require, module */
var mongoose = require('mongoose');
var ServerConfig = mongoose.model('ServerConfig');
var serversManager = require('./serversManager.js');

/**
 * List servers
 */
module.exports.list = function (req, res) {
  var user = req.user;
  ServerConfig.find({
    user: user._id
  }, function (err, serverConfig) {
    if (err) {
      return res.send(500, err);
    }
    res.json(200, serverConfig);
  });
};

/**
 * Create, remove and update server config file
 */

//create should save the config
//and tell the manager to start a new server
//using the config
module.exports.create = function (req, res) {
  var user = req.user;
  var config = req.body;
  config.user = user._id;
  config.status = config.status || {};

  var serverConfig = new ServerConfig(config);

  serverConfig.save(function(err) {
    if (err) {
      return res.send(500, err);
    }

    serversManager.createServer(serverConfig);
    return res.send(201, serverConfig);
  });
};

/**
 *  Get profile of specified server
 */
module.exports.show = function (req, res) {
  var user = req.user._id+'';
  console.log(req.params.id);
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) {
      console.log('~~~~~show server ', err);
      return res.send(500, err);
    } else if (!serverConfig) {
      return res.send(404);
    } else if (user !== serverConfig.user) {
      return res.send(401);
    }

    res.send(200, serverConfig);
  });
};

//find and tell the manager to stop the server,
//and remove the config from the database
module.exports.remove = function(req, res){
  var user = req.user._id+'';
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) {
      return res.send(500, err);
    } else if (!serverConfig) {
      return res.send(404);
    } else if (user !== serverConfig.user) {
      return res.send(401);
    }

    serversManager.deleteServer(serverConfig, function (err) {
      if (err) {
        console.error(err);
        return res.send(500, err);
      }

      serverConfig.remove(function(){
        console.log('---- Succesfully deleted serverConfig', serverConfig.name);
        return res.send(204);
      });
    });
  });
};

//update the server config file
//and tell the manager to update the server's db schema
module.exports.update = function(req, res){
  var user = req.user._id+'';
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) {
      return res.send(500, err);
    } else if (!serverConfig) {
      return res.send(404);
    } else if (user !== serverConfig.user) {
      return res.send(401);
    }

    serversManager.updateServer(req.body.resources);
    return res.send(204);
  });
};


//find the config and tell manager to start the server
module.exports.start = function(req, res){
  var user = req.user._id + '';
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) {
      return res.send(500, err);
    } else if (!serverConfig) {
      return res.send(404);
    } else if (user !== serverConfig.user) {
      return res.send(401);
    }

    serversManager.startServer(serverConfig, function (started) {
      if (started) {
        res.send(204);
      } else {
        res.send(500);
      }
    });
  });
};

//find the config and tell manager to stop the server
module.exports.stop = function(req, res){
  var user = req.user._id+'';
  var serverId = req.params.id;
  console.log('==== serverconfigs stop function');
  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) {
      return res.send(500, err);
    } else if (!serverConfig) {
      return res.send(404);
    } else if (user !== serverConfig.user) {
      return res.send(401);
    }

    console.log('==== serverconfigs found serverconfig');
    serversManager.stopServer(serverConfig, function (stopped) {
      if (stopped) {
        res.send(204);
      } else {
        res.send(500);
      }
    });
  });
};
