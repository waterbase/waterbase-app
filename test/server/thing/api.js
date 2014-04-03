'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest');

var resources = [
  'user',
  'server'
]

for (var r=0, length=resources.length; r<length; r++){

  describe('GET /api/' + resources[r], function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/awesomeThings')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });
  });

}
