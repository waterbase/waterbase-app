'use strict';

var should = require('should');
var request = require('supertest');
var ServerConfig = require('../../../lib/models/ServerConfig.js');
var Server = require('../../../lib/controllers/generation/Server.js');

describe('custom server api', function() {
  var server;
  var serverConfig = new ServerConfig({
    name: 'testing',
    port: 3000,
    resources: {
      animals: {
        attributes: {
          name: {
            type: 'String',
            unique: true
          },
          age: 'Number'
        }
      }
    },
    user: 'Fake User'
  });

  var animalJson = {
    name: 'Cat',
    age: 5
  };

  beforeEach(function(done){
    server = new Server(serverConfig);
    server
      .start(33333)
      .then(done);
  });

  afterEach(function(done){
    server
      .stop()
      .then(done);
  });

  it('should respond to list', function(done) {
    request(server.app)
      .get('/animals')
      //.expect(200)
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
      .put('/animals')
      .send({})
      .expect(204)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should respond to delete all', function(done) {
    request(server.app)
      .del('/animals')
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
      .post('/animals')
      .send(animalJson)
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
    var animal;
    beforeEach(function(done){
      request(server.app)
        .post('/animals')
        .send(animalJson)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          animal = res;
          done();
        });
    });

    it('should respond to show', function(done) {
      request(server.app)
        .get('/animals/'+animal.id)
        .send(animalJson)
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
        .put('/animals/'+animal.id)
        .send({
          age: 30
        })
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          request(server.app)
            .get('/animals/'+animal.id)
            .send(animalJson)
            .expect(204)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              //TODO expect animal.age to be 30
              done();
            });
        });
    });

    it('should respond to deleteOne', function(done) {
      request(server.app)
        .del('/animals/'+animal.id)
        .send(animalJson)
        .expect(204)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          request(server.app)
            .get('/animals/'+animal.id)
            .send(animalJson)
            .expect(404)
            .end(function() {
              done();
            });
          done();
        });
    });
  });
});
