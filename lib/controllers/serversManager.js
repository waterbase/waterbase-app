'use strict';

var herokuManager = require('./herokuManager');

var servers = {};
var portCounter = 20000;
//if server matching the schema does not exist, create one
//regardless, start the server
module.exports.startServer = function(serverConfig){
  var herokuApp = serverConfig.name;

  //create heroku app
  herokuManager.create(herokuApp, function (err, data) {
    //save config with heroku information
    serverConfig.heroku = data;
    serverConfig.save();

    console.log('==== Heroku App Started');
  });
};

//find and update the schema of an existing server
//create if does not exist
//do not change the status of the server
module.exports.updateServer = function(serverConfig){
  var name = serverConfig.heroku.name;
  if (!servers[name]){
    servers[name] = new Server(serverConfig);
  } else {
    servers[name].updateSchema(serverConfig);
  }
};

//find and stop the server
//do nothing if does not exist
module.exports.stopServer = function(serverConfig){
  var herokuApp = serverConfig.heroku.name;

  herokuManager.stop(herokuApp, function () {
    console.log('==== Heroku App Stopped');
    serverConfig.status.running = false;
  });
};
