'use strict';

var Heroku = require('heroku-client');
var fs = require('fs');
var url = require('url');

var heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });

var updateVars = function (appIdOrName, serverId, callback) {
  heroku.apps(appIdOrName).configVars().update({
    SERVER_ID: serverId
  }, callback);
};

var getSlug = function (callback) {
  console.log('==== Started to get minion slugs');
  heroku.apps('waterbase-minion').releases().list(function (err, data) {
    if (err) return console.error(err);
    data.sort(function (a, b) {
      return b.version - a.version;
    });

    var slugId = data[0].slug.id;

    callback(slugId);
  });
};

var createDatabase = function (appIdOrName, callback) {
  heroku.apps(appIdOrName).addons().create({plan:'mongohq'}, callback);
};

var createRelease = function (appIdOrName, callback) {
  console.log('==== Started release');

  // Get slug
  getSlug(function (slugId) {
    console.log('==== Succesfully got slugId', slugId);

    heroku.apps(appIdOrName).releases().create({

      slug        : slugId,
      description : 'initial minion deployment'

    }, function (err, data) {
      if (err) {
        return console.error(err);
      }

      callback(err, data);
    });
  });
};

module.exports.create = function (serverConfig, callback, config) {
  config = config || {};
  console.log('==== Started create');

  // Start creation
  heroku.apps().create({

    region : config.region || 'us',
    stack  : config.stack  || 'cedar'

  }, function (err, herokuResponse) {
    if (err) {
      return console.error(err);
    }

    //save config with heroku information
    serverConfig.heroku = herokuResponse;
    serverConfig.status.running = true;
    serverConfig.save();

    var herokuName = herokuResponse.name;

    console.log('==== Create complete');

    // Create database
    createDatabase(herokuName, function (err, mongoHqResponse) {
      if (err) return console.log(err); // database creation error
      console.log('==== Database created');
      console.log(mongoHqResponse);

      // Set environmental variables
      updateVars(herokuName, serverConfig._id, function (err) {
        if (err) return console.error(err);
        console.log('==== Updated Vars');

        // Release with slug
        createRelease(herokuName, function (err) {
          if (err) return console.error(err);
          console.log('==== Release Complete');

          callback(err, herokuResponse);
        });
      });
    });
  });
};

module.exports.delete = function (appIdOrName, callback) {
  heroku.apps(appIdOrName).delete(callback);
};

module.exports.start = function (appIdOrName, callback) {
  heroku.apps(appIdOrName).formation('web').update({
    quantity : 1
  }, callback);
};

module.exports.stop = function (appIdOrName, callback) {
  heroku.apps(appIdOrName).formation('web').update({
    quantity : 0
  }, callback);
};
