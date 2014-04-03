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

  controller.list = function (req, res, next) {
    ResourceModel.find(function (err, data) {
      if (err) {console.log(err);}
      res.send(data);
    });
  };

  controller.deleteAll = function (req, res, next) {
    ResourceModel.remove().exec()
    .then(function (err, data) {
      if (err) {console.log(err);}
      res.send(data);
    });
  };

  controller.replaceAll = function (req, res, next) {
    ResourceModel.update(req.body.where, req.body.set).exec()
    .then(function (err, data) {
      if (err) {console.log(err);}
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

  controller.retrieve = function (req, res, next) {
    var id = req.params.id;
    ResourceModel.find({id: id}, function (err, data) {
      if (err) return next(err);
      if (!data) return res.send(404);
      console.log('found ' + resourceName);
      res.send(data);
    });
  };

  controller.update = function (req, res, next) {
    var id = req.params.id;
    ResourceModel.update({id: id}}, req.body.set).exec()
    .then(function (err, data) {
      if (err) {console.log(err);}
      res.send(data);
    });
  }

  controller.delete = function (req, res, next) {
    var id = req.params.id;
    ResourceModel.find({id: id}, function (err, data) {
      if (err) return next(err);
      if (!data) return res.send(404);

      data.remove().exec()
      .then(function (err, data) {
        if (err) {console.log(err);}
        res.send(204);
      });
    });
  };

  return controller;
}

var routeMap = {
  //collection
  'list':{
    method: 'GET',
    path: function(name){
      return '/' + name
    }
  },
  'deleteAll':{
    method: 'DELETE',
    path: function(name){
      '/' + name;
    }
  }
  'replaceAll': {
    method: 'PUT',
    path: function(name){
      '/' + name;
    }
  }
  'create':{
    method: 'POST',
    path: function(name){
      '/' + name;
    }
  },
  //element
  'retrieve':{
    method: 'GET',
    path: function(name){
      '/' + name + '/' + name + '_id';
    }
  },
  'update':{
    method: 'POST',
    path: function(name){
      '/' + name + '/' + name + '_id';
    }
  },
  'delete':{
    method: 'DELETE',
    path: function(name){
      '/' + name + '/' + name + '_id';
    }
  }
}

/*
  bootstrap and start a server from a json file
*/
exports.startServer = function (server) {
  var app = express();
  app.use(express.bodyParser());
  // Connect to database
  console.log('Creating new database: ' + server.name);
  var db = mongoose.createConnection(
    'mongodb://localhost/' + server.name,
    { db: { safe:true } }
  );
  // Create MongoDB schema
  var resources = server.resources;

  for (var resourceName in resources) {
    var model = resources[resourceName];
    console.log('============== ' + resourceName + ' ==============');
    // Create mongoose schema
    createSchema(resourceName, model.attributes, db);
    // Create Controllers
    var controllers = createControllers(resourceName, model.access, db);

    for (var action in routeMap){
      var method = routeMap[action].method;
      var path = routeMap[action].path();
      app.on(method, path, controllers[action]);
    }
    app[method](path, controller[key]);
  }

  // Routing
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

exports.stopServer = function (server) {
  server.stop();
};


