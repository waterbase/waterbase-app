'use strict';

var Heroku = require('heroku-client');
var request = require('request');
var fs = require('fs');
var url = require('url');

var heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });

var createRelease = function (appIdOrName, callback) {
  console.log('==== Started release');

  //slug from waterbase-minion
  var slugId = 'bac7a5cd-faf7-42e9-9227-6e7be127567b';

  heroku.apps(appIdOrName).releases().create({

    slug        : slugId,
    description : 'initial minion deployment'

  }, function (err, data) {
    if (err) {
      return console.error(err);
    }

    callback(err, data);
  });
};

module.exports.create = function (callback, config) {
  config = config || {};
  console.log('==== Started create');

  heroku.apps().create({

    region : config.region || 'us',
    stack  : config.stack  || 'cedar'

  }, function (err, data) {
    if (err) {
      return console.error(err);
    }
    console.log('==== Create complete');
    console.log(data);

    createRelease(data.name, function () {
      console.log('==== Release Complete');
      callback(err, data);
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
