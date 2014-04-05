/* global require, describe, before, afterEach, it */

var should = require('should');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fullstack-test');
var ServerConfig = require('../../../lib/models/ServerConfig.js');

var serverConfig;

var serverConfigJson = {
  name: 'testing',
  port: 3000,
  resources: {
    users: {
      attributes: {
        username: {
          type: 'String',
          unique: true
        },
        age: 'Number'
      }
    }
  },
  user: 'Fake User'
};

describe('ServerConfig Model', function() {
  before(function(done) {
    serverConfig = new ServerConfig(serverConfigJson);

    // Clear before testing
    ServerConfig.remove({}).exec();
    done();
  });

  afterEach(function(done) {
    ServerConfig.remove({}).exec();
    done();
  });

  it('should begin with no serverConfigs', function(done) {
    ServerConfig.find({}, function(err, serverConfigs) {
      serverConfigs.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate serverConfig', function(done) {
    serverConfig.save();
    var serverConfigDup = new ServerConfig(serverConfigJson);
    serverConfigDup.save(function(err) {
      should.exist(err);
      done();
    });
  });

});
