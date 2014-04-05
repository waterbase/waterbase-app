/* global module */
var statusCodes = {
  ok: 200,
  created: 201,
  finished: 204,
  notFound: 404,
  error: 500
};

var responder = function(code){
  return function(err, data){
    if (err) {
      return res.send(statusCodes.error, err);
    } else if (!data) {
      return res.send(statusCodes.notFound);
    }
    res.send(code, data);
  };
};

module.exports = function(app, controllers) {
  //collection
  app.get('/api/:collection', function(req, res){
    controllers.retrieveAll(req.param.collection, responder(statusCodes.ok));
  });

  //update all documents
  app.put('/api/:collection', function(req, res){
    controllers.updateAll(
      req.param.collection,
      req.body.where,
      req.body.set,
      responder(statusCodes.finished));
  });

  //delete all documents
  app.del('/api/:collection', function(req, res){
    controllers.deleteAll(req.param.collection, responder(statusCodes.finished));
  });

  //create document
  app.post('/api/:collection', function(req, res){
    controllers.create(req.param.collection, req.body, responder(statusCodes.created));
  });

  //document
  app.get('/api/:collection/:id', function(req, res){
    controllers.retrieveOne(req.param.collection, req.params.id, responder(statusCodes.ok));
  });

  //update document
  app.put('/api/:collection/:id', function(req, res){
    controllers.updateOne(req.param.collection, req.params.id, req.body, responder(statusCodes.finished));
  });

  //delete document
  app.del('/api/:collection/:id', function(req, res){
    controllers.deleteOne(req.param.collection, req.params.id, responder(statusCodes.finished));
  });

  // All undefined api routes should return a 404
  app.get('/*', function(req, res) {
    res.send(404);
  });
};