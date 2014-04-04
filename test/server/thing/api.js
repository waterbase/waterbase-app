'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

describe('users api', function() {
  var userId;
  var userJson = {
    provider: 'local',
    name: 'Fake User 2',
    email: 'test@test.com',
    password: 'password'
  };

  it('should respond to post', function(done) {
    User.remove().exec().then(function(){
      request(app)
        .post('/api/users')
        .send(userJson)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  it('should respond to get using id', function(done) {
    User.remove().exec();
    request(app)
      .post('/api/users')
      .send(userJson)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        User.find({}).exec()
          .then(function(err, users){
            console.log(users);
            request(app)
              .get('/api/users/'+userJson.username)
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .end(function(err, res) {
                if (err) return done(err);
                done();
              });
          });
      });
  });
});

/*
  app.post('/api/users', users.create); +
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  app.get('/api/servers', servers.list);
  app.post('/api/servers', servers.create);
  app.get('/api/servers/:name', servers.show);
  app.post('/api/servers/:name', servers.update);
  app.del('/api/servers/:name', servers.remove);

  app.get('api/servers/:name/start', servers.start);
  app.del('api/servers/:name/stop', servers.stop);
 */
