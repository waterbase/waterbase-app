/* global module */
var statusCodes = {
  ok: 200,
  created: 201,
  finished: 204,
  notFound: 404,
  error: 500
};

var responder = function(code, res){
  return function(err, data){
    if (err) {
      console.trace('sending err', err);
      return res.send(statusCodes.error, err);
    } else if (!data) {
      console.log('sending 404');
      return res.send(statusCodes.notFound);
    }
    console.log('responding', code);
    res.send(code, data);
  };
};

module.exports = function(app, controllers) {
  //collection
  app.get('/:collection', function(req, res){
    controllers.retrieveAll(
      req.params.collection,
      responder(statusCodes.ok, res));
  });

  //update all documents
  app.put('/:collection', function(req, res){
    controllers.updateAll(
      req.params.collection,
      req.body.where,
      req.body.set,
      responder(statusCodes.finished));
  });

  //delete all documents
  app.del('/:collection', function(req, res){
    controllers.deleteAll(
      req.params.collection,
      responder(statusCodes.finished, res));
  });

  //create document
  app.post('/:collection', function(req, res){
    controllers.create(
      req.params.collection,
      req.body,
      responder(statusCodes.created, res));
  });

  //document
  app.get('/:collection/:id', function(req, res){
    controllers.retrieveOne(
      req.params.collection,
      req.params.id,
      responder(statusCodes.ok, res));
  });

  //update document
  app.put('/:collection/:id', function(req, res){
    controllers.updateOne(
      req.params.collection,
      req.params.id,
      req.body,
      responder(statusCodes.finished, res));
  });

  //delete document
  app.del('/:collection/:id', function(req, res){
    controllers.deleteOne(
      req.params.collection,
      req.params.id,
      responder(statusCodes.finished, res));
  });

  // All undefined api routes should return a 404
  app.get('/*', function(req, res) {
    console.log('not in route');
    res.send(404);
  });
};
