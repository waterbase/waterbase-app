'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest');

describe('GET /api/serverJson', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/serverJson')
      .expect(201)
      .expect('Content-Type', 'application/json')
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
