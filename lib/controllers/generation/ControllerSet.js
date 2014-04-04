/* global module */
var statusCodes = {
  ok: 200,
  created: 201,
  finished: 204,
  notFound: 404,
  error: 500
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
    var Model = db.model(req.param.collection);
    var model = new Model(req.body);
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
