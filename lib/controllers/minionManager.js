'use strict';

var ServerConfig = require('../models/ServerConfig');

module.exports.getConfig = function (req, res) {
  console.log('========= Starting minion getConfig', req.host);
  var herokuUrl = req.host;

  ServerConfig.find({ heroku: { url: herokuUrl } }, function (err, serverConfigs) {
      if (err) {
        console.log('~~~~~minion config ', err);
        return res.send(500, err);
      } else if (!serverConfigs.length) {
        return res.send(404);
      }

      console.log('~~~~~SUCCESS: minion config');
      res.send(200, serverConfigs[0]);
    });
};

module.exports.createResource = function (req, res) {

};

module.exports.updateResource = function (req, res) {

};
