/*global module, require */
var Server = require('./generation/Server.js');

var servers = {};
var portCounter = 20000;
//if server matching the schema does not exist, create one
//regardless, start the server
module.exports.startServer = function(serverConfig, callback){
  var name = serverConfig.name;
  console.log('++++ attempting to start', name);
  if (!servers[name]){
    console.log('++++ server not created, now creating', name);
    servers[name] = new Server(serverConfig);
  }
  console.log('++++ attempting to start on port', name, portCounter);
  console.log('portCounter, ', portCounter);
  servers[name].start(++portCounter, function(){
    callback();
  });
};

//find and update the schema of an existing server, 
//create if does not exist
//do not change the status of the server
module.exports.updateServer = function(serverConfig){
  var name = serverConfig.name;
  if (!servers[name]){
    servers[name] = new Server(serverConfig);
  } else {
    servers[name].updateSchema(serverConfig);
  }
};

//find and stop the server
//do nothing if does not exist
module.exports.stopServer = function(serverConfig){
  var name = serverConfig.name;
  console.log('---- attempting to stop', name);
  if (!servers[name]){
    console.log('---- server not running', name);
    serverConfig.status.port = 0;
    serverConfig.save();
    return;
  }

  console.log('---- stopping server', serverConfig.name);
  servers[name].stop();
};
