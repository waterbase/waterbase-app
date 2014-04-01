'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

function createSchema(resourceName, attributes, db) {
  console.log('== creating schema for ' + resourceName);

  for (var attribute in attributes) {
    console.log('ATTRIBUTE: ' + attribute + ': "' + attributes[attribute] + '"');
  }

  var schema = new mongoose.Schema(attributes);

  db.model(resourceName, schema);
}

function createControllers(resourceName, methods, db) {
  console.log('== creating controllers for ' + resourceName);
  var controller = {};
  var ResourceModel = db.model(resourceName);
  // methods.forEach(function (item) {
  //   console.log(item);
  // });

  controller.list = function (req, res, next) {
    ResourceModel.find(function (err, data) {
      if (err) {console.log(err);}
      res.send(data);
    });
  };

  controller.show = function (req, res, next) {
    var id = req.params.id;

    ResourceModel.find({id: id}, function (err, data) {
      if (err) return next(err);
      if (!data) return res.send(404);
      console.log('found ' + resourceName);
      res.send(data);
    });
  };

  controller.create = function (req, res, next) {
    var model = new ResourceModel(req.body);

    model.save(function (err) {
      if (err) res.json(400, err);

      return res.json(model);
    });
  };

  return controller;
}

function createRoutes(name, methods, app, controller) {
  console.log('== creating routes for ' + name);
  var method;
  var path;

  for (var i = 0; i < methods.length; i++) {
      var key = methods[i];
      console.log('checking ' + key);
      switch (key)
      {
      case 'list':
        method = 'get';
        path = '/' + name;
        break;
      case 'show':
        method = 'get';
        path = '/' + name + '/' + name + '_id';
        break;
      case 'edit':
        method = 'get';
        path = '/' + name + '/' + name + '_id/edit';
        break;
      case 'update':
        method = 'put';
        path = '/' + name + '/' + name + '_id';
        break;
      case 'create':
        method = 'post';
        path = '/' + name;
        break;
      case 'delete':
        method = 'del';
        path = '/' + name + '/' + name + '_id';
        break;
      }
      console.log(name + ' ' + key);
      console.log('method: ' + method);
      console.log('path: ' + path);

      // name[key] = function (req, res, next) {
      //   console.log('yay');
      //   next();
      // };
      app[method](path, controller[key]);
      // console.log(app[method] + "");
    }
}

exports.startServer = function (server) {
  /**
   * Main application file
   */

  var app = express();

  app.use(express.bodyParser());
  // Connect to database

  console.log('Creating new database: ' + server.name);

  var db = mongoose.createConnection('mongodb://localhost/' + server.name, { db: { safe:true } });

  // Create MongoDB schema
  var resources = server.resources;

  for (var resourceName in resources) {
    var model = resources[resourceName];
    console.log('============== ' + resourceName + ' ==============');
    // Create mongoose
    createSchema(resourceName, model.attributes, db);

    // Create Controllers
    var controller = createControllers(resourceName, model.methods, db);
    console.log(controller);
    // Create Routes
    createRoutes(resourceName, model.methods, app, controller);
  }

  // // Bootstrap models
  // var modelsPath = path.join(__dirname, 'lib/models');
  // fs.readdirSync(modelsPath).forEach(function (file) {
  //   if (/(.*)\.(js$|coffee$)/.test(file)) {
  //     require(modelsPath + '/' + file);
  //   }
  // });

  // // Populate empty DB with sample data
  // require('./lib/config/dummydata');

  // // Express settings
  // require('./lib/config/express')(app);

  // // Routing
  // require('./lib/routes')(app);
  app.all('/*', function (req, res, next) {
    res.send(404);
  });


  // Start server
  app.listen(server.port, function () {
    console.log('Express server listening on port %d', server.port);
  });

  // // Expose app
  // exports = module.exports = app;
};

exports.stopServer = function () {

};


