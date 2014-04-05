'use strict';

var should = require('should');
var app = require('../../../server');
var request = require('supertest');
var mongoose = require('mongoose');
var User = mongoose.model('User');

describe('users api', function() {
  var user;
  var credential;

  before(function(done){
    User.remove(function(){
      user = new User({
        provider: 'local',
        name: 'Fake User',
        email: 'test@test.com',
        password: 'password'
      });
      user.save(function(){
        done();
      });
    });
  });

  it('should login', function(done) {
    request(app)
    .post('/api/session')
    .send({
      email: user.email,
      password: user.password
    })
    .expect(201)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.email.should.equal(user.email);
      done();
    });
  });

  it('should get by id', function(done) {
    request(app)
    .del('/api/session')
    .expect(200)
    .end(function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

});
