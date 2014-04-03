'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Server = mongoose.model('Server');

var server;

var serverJson = {
  name: 'testing',
  port: 3000,
  url: 'localhost:9000/api/servers/testing',
  resources: {
    users: {
      attributes: {
        username: {
          type: 'String',
          unique: true
        }
        age: 'Number'
      }
    },
    messages: {
      attributes: {
        text: 'String'
      }
    },
    rooms: {
      attributes: {
        name: 'String',
      }
    }
  }
}

describe('Server Model', function() {
  before(function(done) {
    server = new Server(serverJson);

    // Clear users before testing
    server.remove().exec();
    done();
  });

  afterEach(function(done) {
    User.remove().exec();
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
