/*global module, require */
var Server = require('./generation/Server.js');

var servers = {};

//if server matching the schema does not exist, create one
//regardless, start the server
module.exports.startServer = function(serverConfig){
  var name = serverConfig.name;
  if (!servers[name]){
    servers[name] = new Server(serverConfig);
  }
  servers[name].start();
};

//find and update the schema of an existing server
//create if does not exist
//do not change the status of the server
module.exports.updateServer = function(serverConfig){
  var name = serverConfig.name;
  if (!servers[name]){
    servers[name] = new Server(serverConfig);
  } else {
    servers[name].updateConfig(serverConfig);
  }
};

//find and stop the server
//do nothing if does not exist
module.exports.stopServer = function(serverConfig){
  var name = serverConfig.name;
  if (!servers[name]){
    return;
  }
  servers[name].stop();
};
