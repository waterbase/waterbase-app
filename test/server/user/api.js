'use strict';

var should = require('should');
var app = require('../../../server');
var request = require('supertest');
var mongoose = require('mongoose');
var User = mongoose.model('User');

describe('users api', function() {
  var userId;
  var userJson = {
    provider: 'local',
    name: 'Fake User 2',
    email: 'test@test.com',
    password: 'password'
  };

  before(function(done){
    User.remove(function(){
      console.log('flushed');
      done();
    });
  });

  it('should respond to create', function(done) {
    request(app)
    .post('/api/users')
    .send(userJson)
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      userId = res.body._id;
      done();
    });
  });

  it('should get by id', function(done) {
    request(app)
    .get('/api/users/'+userId)
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      console.log(res.body._id);
      done();
    });
  });

  it('should respond to get self', function(done) {
    request(app)
    .post('/api/session')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .end(function(err, res){
      console.log('login', err, res.body);
      request(app)
      .get('/api/users/me')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        console.log('get me', res.body);
        done();
      });
    });
  });
});

/*

  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);

 */
