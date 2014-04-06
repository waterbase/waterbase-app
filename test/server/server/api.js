/* global require */

var should = require('should');
var app = require('../../../server');
var app = require('../../../server');
var Session = require('supertest-session')({app:app});
var ServerConfig = require('../../../lib/models/ServerConfig.js');
var User = require('../../../lib/models/User.js');

describe('serverConfig api', function() {
  var user, serverConfig;
  var session;

  before(function(done){
    serverConfig = new ServerConfig({
      name: 'testing',
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
      }
    });
    User.remove(function(){
      user = new User({
        provider: 'local',
        name: 'Fake User',
        email: 'test@test.com',
        password: 'password'
      });
      user.save(function(){
        serverConfig.user = user._id;
        ServerConfig.remove(function(){
          serverConfig.save(done);
        });
      });
    });
  });

  beforeEach(function(done){
    session = new Session();
    session.post('/api/session')
    .send({
      email: user.email,
      password: user.password
    })
    .end(done);
  });

  afterEach(function(){
    session.destroy();
  });

  it('should respond to list', function(done) {
    session
    .get('/api/servers')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.length.should.equal(1);
      done();
    });
  });

  it('should respond to remove all', function(done) {
    session
    .get('/api/servers')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.length.should.equal(1);
      done();
    });
  });

  it('should respond to list', function(done) {
    session
    .get('/api/servers')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.length.should.equal(1);
      done();
    });
  });

  it('should respond to list', function(done) {
    session
    .get('/api/servers')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.length.should.equal(1);
      done();
    });
  });

  it('should respond to list', function(done) {
    session
    .get('/api/servers')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.length.should.equal(1);
      done();
    });
  });

  it('should respond to list', function(done) {
    session
    .get('/api/servers')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.length.should.equal(1);
      done();
    });
  });

  it('should respond to list', function(done) {
    session
    .get('/api/servers')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.length.should.equal(1);
      done();
    });
  });
});
