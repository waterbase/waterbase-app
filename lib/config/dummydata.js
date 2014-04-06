'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var ServerConfig = mongoose.model('ServerConfig');

  var seedServerConfig = false;
  var seedUser = false;

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


if (seedServerConfig) {
  ServerConfig.find({}).remove(function () {
    ServerConfig.create({
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
      },
      status: {
        running: true
      }
    }, function () {
          console.log('finished populating servers');
      }
    );
  });
}


var convertAttributes = function(array) {
  var newAttributesObject = {};
  array.forEach(function(attribute) {
    newAttributesObject[attribute['name']] = attribute['type'];
  });
  return newAttributesObject;
};

// convert each resource to mongoDB style object

var convertResource = function(object) {
  var newResourceObject = {};
  var resourceName = object['resourceName'];
  var attributesArray = object['attributes'];
  var attributesObject = convertAttributes(attributesArray);
  attributesObject['methods'] = ['list', 'create','show'];
  newResourceObject[resourceName] = {};
  newResourceObject[resourceName]['attributes'] = attributesObject;
  return newResourceObject;
}

console.log(convertResource({resourceName: 'users', attributes: [{name:'name', type:'String'},{name:'messages', type:'String'}]}))

var attributes = [{name:'name', type:'String'},{name:'bloodType', type:'String'}];
console.log(convertAttributes(attributes));
