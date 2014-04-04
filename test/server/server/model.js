'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    //Server = mongoose.model('Server');
    Server = require('../../../lib/models/server.js');

var server;

var serverJson = {
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

describe('Server Model', function() {
  before(function(done) {
    server = new Server(serverJson);

    // Clear before testing
    Server.remove({}).exec();
    done();
  });

  afterEach(function(done) {
    Server.remove({}).exec();
    done();
  });

  it('should begin with no servers', function(done) {
    Server.find({}, function(err, servers) {
      servers.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate server', function(done) {
    server.save();
    var serverDup = new Server(serverJson);
    serverDup.save(function(err) {
      should.exist(err);
      done();
    });
  });

});
