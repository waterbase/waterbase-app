'use strict';

var ServerConfig = require('../models/ServerConfig');

module.exports.getConfig = function (req, res) {
  console.log('~~~~~START: minion getConfig', req.params.id);
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfig) {
      if (err) {
        console.error('~~~~~ERROR: minion config', err);
        return res.send(500, err);
      } else if (!serverConfig) {
        return res.send(404);
      }

      console.log('~~~~~SUCCESS: minion config');
      res.json(200, serverConfig);
    });
};

module.exports.updateResource = function (req, res) {
  var update = req.body;
  var serverId = req.params.id;

  console.log('===== Updating Server:', serverId);
  console.log('Update:', update);

  ServerConfig.findById(serverId, function (err, serverConfig) {
    if (err) return console.error(err);

    serverConfig.resources[update.name] = update.attributes;
    serverConfig.save(function (err, serverConfig) {
      if (err) return console.error(err);

      console.log('Successfully updated config');
      console.log(serverConfig);
    });
  });
};
