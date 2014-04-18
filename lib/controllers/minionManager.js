'use strict';

var ServerConfig = require('../models/ServerConfig');

module.exports.getConfig = function (req, res) {
  console.log('========= Starting minion getConfig', req.params.id);
  var serverId = req.params.id;

  ServerConfig.findById(serverId, function (err, serverConfigs) {
      if (err) {
        console.log('~~~~~minion config ', err);
        return res.send(500, err);
      } else if (!serverConfigs) {
        return res.send(404);
      }

      console.log('~~~~~SUCCESS: minion config');
      res.json(200, serverConfigs);
    });
};

module.exports.createResource = function (req, res) {

};

module.exports.updateResource = function (req, res) {

};
