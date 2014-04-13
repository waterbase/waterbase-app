'use strict';

var should = require('should');
var request = require('supertest');
var ServerConfig = require('../../../lib/models/ServerConfig.js');
var Server = require('../../../lib/controllers/generation/Server.js');

describe('custom server api', function() {
  var serverConfig = new ServerConfig({
    name: 'testing',
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
  var server = new Server(serverConfig);

  var animalJson = {
    name: 'Cat',
    age: 5
  };

  beforeEach(function(done){
    server
      .start(33333)
      .then(function(next){
        done();
        next();
      });
  });

  afterEach(function(done){
    server
      .stop()
      .then(function(next){
        done();
        next();
      });
  });

  xit('should respond to list', function(done) {
    request(server.app)
      .get('/animals')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should respond to update all', function(done) {
    try{
    request(server.app)
      .put('/animals')
      .send({})
      .expect(205)
      .end(function(err, res) {
        console.log('====== update all');
        if (err) {
          return done(err);
        }
        done();
      });
    } catch (err){
      console.trace(err);
    } 
  });

  xit('should respond to delete all', function(done) {
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
  xit('should respond to create', function(done) {
    request(server.app)
      .post('/animals')
      .send(animalJson)
      .expect(201)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  //elements
  xdescribe('elements', function(){
    var animal;
    beforeEach(function(done){
      request(server.app)
        .del('/animals')
        .end(function(){
          request(server.app)
            .post('/animals')
            .send(animalJson)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              animal = res.body;
              console.log('create for element test', animal);
              done();
            });
        });
    });

    afterEach(function(done){
      request(server.app)
        .del('/animals')
        .end(done);
    })

    it('should respond to show', function(done) {
      console.log('testing show')
      request(server.app)
        .get('/animals/'+animal._id)
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
      console.log('testing update')
      request(server.app)
        .put('/animals/'+animal._id)
        .send({
          age: 30
        })
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          request(server.app)
            .get('/animals/'+animal._id)
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
      console.log('testing delete')
      request(server.app)
        .del('/animals/'+animal._id)
        .send(animalJson)
        .expect(204)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          request(server.app)
            .get('/animals/'+animal._id)
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
