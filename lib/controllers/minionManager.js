'use strict';

var mongoose = require('mongoose');
var ServerConfig = mongoose.model('ServerConfig');

module.exports.getConfig = function (req, res) {
  console.log('~~~~~ START: getConfig', req.params.id);
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfig) {
      if (err) {
        console.log('~~~~~ ERROR: getConfig ', err);
        return res.send(500, err);
      } else if (!serverConfig) {
        return res.send(404);
      }

      console.log('~~~~~ SUCCESS: getConfig');
      res.json(200, serverConfig);
    });
};

module.exports.updateResource = function (req, res) {
  var update = req.body;
  var serverId = req.params.id;

  console.log('===== Updating Server:', serverId);
  console.log('Update:', update);

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) return res.send(404, err);

    serverConfig.resources[update.name] = update.attributes;
    serverConfig.save(function (err, serverConfig) {
      if (err) return res.send(500, err);

      console.log('Successfully updated config');
      console.log(serverConfig);
      res.send(200, serverConfig);
    });
  });
};

module.exports.updateUri = function (req, res) {
  var serverId = req.params.id;
  var databaseUri = req.body.databaseUri;

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) return res.send(404, err);

    serverConfig.databaseUri = databaseUri;
    serverConfig.save(function (err, serverConfig) {
      if (err) return res.send(500, err);

      console.log('Successfully updated databaseUri');
      console.log(serverConfig);
      res.send(200, serverConfig);
    });
  });
};
