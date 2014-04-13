/* global require, module */
var ServerConfig = require('mongoose').model('ServerConfig');
var serverManager = require('./controllers/serverManager.js');

module.exports = function(){
  ServerConfig.find({})
    .exec()
    .then(function(configs){
      configs.forEach(function(serverConfig){
        if (serverConfig.status.port){
          serverConfig.status.port = 0;
          serverManager.startServer(serverConfig);
        }
      })
    })
};