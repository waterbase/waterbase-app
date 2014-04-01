'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Server = mongoose.model('Server');

/**
 * Populate database with sample application data
 */

// Clear old users, then add a default user
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, function() {
      console.log('finished populating users');
    }
  );
});

Server.find({}).remove(function () {
  Server.create({
    name: 'testing',
    port: 3000,
    url: 'localhost:9000/api/servers/testing',
    resources: {
      users: {
        attributes: {
          username: 'STRING',
          age: 'STRING'
        },
        methods: ['list', 'create','show']
      },
      messages: {
        attributes: {

        },
        methods: ['list', 'create','show']
      },
      rooms: {
        attributes: {

        },
        methods: ['list', 'create','show']
      }
    }
  }, function () {
        console.log('finished populating servers');
    }
  );
});
