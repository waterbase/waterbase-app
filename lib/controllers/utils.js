// var server = {
//   name: 'testing',
//   port: 3000,
//   url: 'localhost:9000/api/servers/testing',
//   resources: {
//     users: {
//       attributes: {
//         username: 'STRING',
//         age: 'STRING'
//       },
//       types: ['GET', 'POST','UPDATE', 'DELETE']
//     },
//     messages: {
//       attributes: {

//       },
//       types: ['GET', 'POST','UPDATE', 'DELETE']
//     },
//     rooms: {
//       attributes: {

//       },
//       types: ['GET', 'POST','UPDATE', 'DELETE']
//     }
//   }
// };

exports.startServer = function (server) {
  'use strict';

  var express = require('express'),
      path = require('path'),
      fs = require('fs'),
      mongoose = require('mongoose');

  /**
   * Main application file
   */

  // Connect to database

  console.log('Creating new database: ' + server.name);

  var db = mongoose.createConnection('mongodb://localhost/' + server.name, { db: { safe:true } });

  // Create MongoDB schema
  var resources = server.resources;

  console.log(server.resources);
  for (var resource in resources) {
    var model = resources[resource];

    // Create mongoose
    for (var attribute in model.attributes) {
      console.log('ATTRIBUTE: ' + attribute + ': ' + model.attributes[attribute]);
    }

    // Create Routes
    for (var i = 0; i < model.methods.length; i++) {
      console.log('REQUEST TYPE: ' + model.methods[i]);
    }
  }

  // for (var resource in resources) {
  //   console.log(resource);
  //   // Create attributes
  //   console.log('attributes: ' + resource.attributes);
  //   for (var attribute in resource.attributes) {
  //     console.log(attribute);
  //   }

  //   // Create routes
  //   console.log('routes');
  //   for (var i = 0; i < resource.type.length; i++) {
  //     console.log(resource.types[i]);
  //   }

  // }


  // // Bootstrap models
  // var modelsPath = path.join(__dirname, 'lib/models');
  // fs.readdirSync(modelsPath).forEach(function (file) {
  //   if (/(.*)\.(js$|coffee$)/.test(file)) {
  //     require(modelsPath + '/' + file);
  //   }
  // });

  // // Populate empty DB with sample data
  // require('./lib/config/dummydata');

  // // Passport Configuration
  // var passport = require('./lib/config/passport');

  // var app = express();

  // // Express settings
  // require('./lib/config/express')(app);

  // // Routing
  // require('./lib/routes')(app);

  // // Start server
  // app.listen(config.port, function () {
  //   console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
  // });

  // // Expose app
  // exports = module.exports = app;
};

exports.stopServer = function () {

};

