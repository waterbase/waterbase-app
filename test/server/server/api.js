/* global require */

var should = require('should');
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
    serverConfig2 = new ServerConfig({
      name: 'testing2',
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
    serverConfigUpdate = new ServerConfig({
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
        },
        accounts: {
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

  it('should respond to create', function(done) {
    session
    .post('/api/servers')
    .send(serverConfig2)
    .expect(201)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.user.should.equal(user._id);
      done();
    });
  });

  it('should respond to show', function(done) {
    session
    .get('/api/servers/'+serverConfig._id)
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.name.should.equal(serverConfig.name);
      done();
    });
  });

  it('should respond to update', function(done) {
    session
    .get('/api/servers/'+serverConfig._id)
    .send(serverConfigUpdate)
    .expect(204)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      session
      .get('/api/servers/'+serverConfig._id)
      .expect(404)
      .end(function(err, res){
        if(err){
          return done(err);
        }
        res.body._id.should.equal(serverConfig._id);
        res.body.name.should.equal(serverConfigUpdate.name);
        done();
      });
      done();
    });
  });

  it('should respond to remove', function(done) {
    session
    .del('/api/servers/'+serverConfig._id)
    .expect(204)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      session
      .get('/api/servers/'+serverConfig._id)
      .expect(404)
      .end(done);
    });
  });
});
