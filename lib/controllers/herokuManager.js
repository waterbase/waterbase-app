'use strict';

var Heroku = require('heroku-client');

var heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });
console.log();
var slug = 'https://www.dropbox.com/s/3or58hni9q0v528/slug.tgz';

var sendRelease = function (appIdOrName, callback, config) {
  config = config || {};
  console.log('==== Started release');
  heroku.apps(appIdOrName).releases().create({

    slug        : config.slug        || slug,
    description : config.description || 'initial minion deployment'

  }, callback);
};

module.exports.create = function (appName, callback, config) {
  config = config || {};
  if (!appName) {
    throw 'must provide app name as first argument';
  }

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

    sendRelease(appName, callback);
  });
};

module.exports.delete = function (appIdOrName, callback) {
  heroku.apps(appIdOrName).delete(handleResponse(callback));
};

module.exports.start = function (appIdOrName, callback) {
  heroku.apps(appIdOrName).formations().batchUpdate({
    quantity : 1
  }, callback);
};

module.exports.stop = function (appIdOrName, callback) {
  heroku.apps(appIdOrName).formations().batchUpdate({
    quantity : 0
  }, callback);
};

