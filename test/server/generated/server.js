'use strict';

var should = require('should');
var request = require('supertest');
var Server = require('../../../lib/controllers/generation/Server.js');

describe('custom server api', function() {
  var server;
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

  var userJson = {
    username: 'Alice',
    age: 20
  };

  beforeEach(function(){
    server = new Server(serverConfigJson);
    //server.app.start();
  });

  afterEach(function(){
    //server.app.stop();
  });

  it('should respond to list', function(done) {
    request(server.app)
      .get('/users')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        console.log('+++++++', res.body);
        done();
      });
  });

  it('should respond to update all', function(done) {
    request(server.app)
      .put('/users')
      .expect(204)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should respond to update all', function(done) {
    request(server.app)
      .del('/users')
      .expect(204)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  //create
  it('should respond to create', function(done) {
    request(server.app)
      .post('/users')
      .send(userJson)
      .expect(202)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  //elements
  describe('elements', function(){
    var user;
    beforeEach(function(done){
      request(server.app)
        .post('/users')
        .send(userJson)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          user = res;
          done();
        });
    });

    it('should respond to show', function(done) {
      request(server.app)
        .get('/users/'+user.id)
        .send(userJson)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond to updateOne', function(done) {
      request(server.app)
        .put('/users/'+user.id)
        .send({
          age: 30
        })
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          request(server.app)
            .get('/users/'+user.id)
            .send(userJson)
            .expect(204)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              //TODO expect user.age to be 30
              done();
            });
        });
    });

    it('should respond to deleteOne', function(done) {
      request(server.app)
        .del('/users/'+user.id)
        .send(userJson)
        .expect(204)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          request(server.app)
            .get('/users/'+user.id)
            .send(userJson)
            .expect(404)
            .end(function() {
              done();
            });
          done();
        });
    });
  });
});
