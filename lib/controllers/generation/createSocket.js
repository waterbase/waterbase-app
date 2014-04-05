var ControllerSet = require('./ControllerSet.js');
var socketServer = require('socket.io');

var Sockets = module.exports = function (db, controllers) {
  this.controllers = controllers || new ControllerSet(db);
};

Sockets.prototype.listen = function(expressServer) {
  this.io = new socketServer(expressServer);

  this.init();
};

Sockets.prototype.init = function() {
  var context = this;

  this.io.on('connection', function (conn) {
    conn.on('list', function () {
      context.list.apply(context, arguments);
    });
    conn.on('show', function () {
      context.show.apply(context, arguments);
    });
    conn.on('create', function () {
      context.create.apply(context, arguments);
    });
    conn.on('update', function () {
      context.update.apply(context, arguments);
    });
    conn.on('delete', function () {
      context.delete.apply(context, arguments);
    });

    conn.on('close', function () {

    });
  });
};

Sockets.prototype.list = function(collectionName, cb) {
  this.controllers.retrieveAll(collectionName,
    this.handleRequest(cb));
};

Sockets.prototype.show = function(collectionName, id, cb) {
  this.controllers.retrieveOne(collectionName,
    this.handleRequest(cb));
};

Sockets.prototype.create = function(collectionName) {

};

Sockets.prototype.update = function(collectionName) {

};

Sockets.prototype.delete = function(collectionName, obj, cb) {
  this.controllers.delete(collectionName,
    this.handleRequest(cb));
};

Sockets.prototype.updateOne = function(collectionName) {

};

Sockets.prototype.deleteOne = function(collectionName) {

};

Sockets.prototype.handleRequest = function(cb) {
  return function (err, data) {
    cb(err, data);
  };
};

var socketHandler = {};

socketHandler.show = function () {};
socketHandler.create = function () {};
socketHandler.update = function () {};
socketHandler.delete = function () {};

echo.on('connection', function (conn) {
  conn.on('list', socketHandler.list);
  conn.on('show', socketHandler.show);
  conn.on('create', socketHandler.create);
  conn.on('update', socketHandler.update);
  conn.on('delete', socketHandler.delete);

  conn.on('close', function () {

  });
});












module.exports = function (db) {
  this.retrieveAll = function () {

  };

};

module.exports = function (serverConfig, db) {
  this.retrieveAll = function (req, res) {
    db.model(req.param.collection)
      .find(function (err, data) {
        if (err) {
          res.send(statusCodes.error, err);
        }
        res.send(statusCodes.ok, data);
      });
  };

  this.updateAll = function (req, res) {
    db.model(req.param.collection)
      .update(req.body.where, req.body.set).exec()
      .then(function (err, data) {
        if (err) {
          res.send(statusCodes.error, err);
        }
        res.send(statusCodes.finished, data);
      });
  };

  this.deleteAll = function (req, res) {
    db.model(req.param.collection)
      .remove().exec()
      .then(function (err, data) {
        if (err) {
          res.send(statusCodes.error, err);
        }
        res.send(statusCodes.finished, data);
      });
  };

  //create element
  this.create = function (req, res) {
    var Collection = db.model(req.param.collection);
    var model = new Collection(req.body);
    model.save(function (err) {
      if (err) {
        res.json(statusCodes.error, err);
      }
      return res.json(statusCodes.created, model);
    });
  };

  //element
  this.retrieveOne = function (req, res) {
    var id = req.params.id;
    db.model(req.param.collection)
      .find({id: id}, function (err, data) {
        if (err) {
          res.json(statusCodes.error, err);
        }
        if (!data) {
          return res.send(statusCodes.notFound);
        }
        res.send(statusCodes.found, data);
      });
  };

  this.updateOne = function (req, res) {
    var id = req.params.id;
    db.model(req.param.collection)
      .update({id: id}, req.body.set).exec()
      .then(function (err, data) {
        if (err) {
          res.send(statusCodes.error, err);
        }
        res.send(statusCodes.finished, data);
      });
  };

  this.deleteOne = function (req, res) {
    var id = req.params.id;
    db.model(req.param.collection)
      .find({id: id}, function (err, data) {
        if (err) {
          res.send(statusCodes.error, err);
        }
        if (!data) {
          res.send(statusCodes.notFound);
        }
        data.remove().exec()
          .then(function (err) {
            if (err) {
              res.send(statusCodes.error, err);
            }
            res.send(statusCodes.finished);
          });
      });
  };
};
