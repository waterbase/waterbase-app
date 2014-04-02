'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Server = mongoose.model('Server');

  var seedServer = true;
  var seedUser = true;




/**
 * Populate database with sample application data
 */

// Clear old users, then add a default user
if (seedUser) {
  User.find({}).remove(function() {
    User.create({
      provider: 'local',
      name: 'agchou',
      email: 'agchou@hackreactor.com',
      password: 'password'
    }, function() {
        console.log('finished populating users');
      }
    );
  });
}

if (seedServer) {
  Server.find({}).remove(function () {
    Server.create({
      name: 'testing',
      port: 3000,
      url: 'localhost:9000/api/servers/testing',
      resources: {
        users: {
          attributes: {
            username: 'String',
            age: 'Number'
          },
          methods: ['list', 'create','show']
        },
        messages: {
          attributes: {
            text: 'String'
          },
          methods: ['list', 'create','show']
        },
        rooms: {
          attributes: {
            name: 'String'
          },
          methods: ['list', 'create','show']
        }
      }
    }, function () {
          console.log('finished populating servers');
      }
    );
  });
}
