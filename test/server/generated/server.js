'use strict';

var should = require('should');
var request = require('supertest');
var Server = require('../../../lib/controllers/generation/Server.js');

describe('users api', function() {
  var server;
  var serverConfig = {
    name: 'testing',
    port: 3000,
    resources: {
      users: {
        attributes: {
          username: 'String',
          age: 'Number'
        }
      }
    }
  };

  var userJson = {
    name: 'Some One',
    age: 20
  };

  beforeEach(function(){
    server = new Server(serverConfig);
  });

  it('should respond to list', function(done) {
    request(server)
      .get('/users')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should respond to update all', function(done) {
    request(server)
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
    request(server)
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
    request(server)
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
      request(server)
        .post('/users')
        .send(userJson)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          console.log(res);
          user = res;
          done();
        });
    });

    it('should respond to show', function(done) {
      request(server)
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
      request(server)
        .put('/users/'+user.id)
        .send({
          age: 30
        })
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          request(server)
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
      request(server)
        .del('/users/'+user.id)
        .send(userJson)
        .expect(204)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          request(server)
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
