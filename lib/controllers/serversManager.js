'use strict';

var herokuManager = require('./herokuManager');

var servers = {};
var portCounter = 20000;
//if server matching the schema does not exist, create one
//regardless, start the server
module.exports.createServer = function(serverConfig, callback){
  var herokuApp = serverConfig.name;

  //create heroku app
  herokuManager.create(serverConfig, function (err, data) {
    if (err) {
      callback(false);
      return console.error(err);
    }

    callback(true);
    console.log('==== Heroku App Creation Finished', herokuApp);
    console.log(data);
  });
};

module.exports.startServer = function(serverConfig, callback){
  var herokuApp = serverConfig.heroku.name;
  console.log('==== Starting to start:',herokuApp);

  herokuManager.start(herokuApp, function (err, data) {
    if (err) {
      console.error(err);
      return callback(false);
    }

    serverConfig.status.running = true;
    serverConfig.save();

    callback(true);
    console.log('==== Heroku App Starting',herokuApp);
  });
};

//find and update the schema of an existing server,
//create if does not exist
//do not change the status of the server
// module.exports.updateServer = function(serverConfig){
//   var name = serverConfig.heroku.name;
//   if (!servers[name]){
//     servers[name] = new Server(serverConfig);
//   } else {
//     servers[name].updateSchema(serverConfig);
//   }
// };

//find and stop the server
//do nothing if does not exist
module.exports.stopServer = function(serverConfig, callback){
  var herokuApp = serverConfig.heroku.name;
  console.log('==== Starting to stop:',herokuApp);

  herokuManager.stop(herokuApp, function (err, data) {
    if (err) {
      console.error(err);
      return callback(false);
    }

    serverConfig.status.running = false;
    serverConfig.save();

    callback(true);
    console.log('==== Heroku App Stopped',herokuApp);
  });
};

module.exports.deleteServer = function(serverConfig, callback){
  console.log('==== Starting to delete:',serverConfig.name);

  if (serverConfig.heroku) {
    var herokuApp = serverConfig.heroku.name;

    herokuManager.delete(herokuApp, function (err, data) {
      if (err) console.error(err);

      console.log('==== Heroku App Deleted',herokuApp);
      callback(err, data);
    });
  } else {
    console.log('==== No heroku app found');
    callback(null);
  }
};
