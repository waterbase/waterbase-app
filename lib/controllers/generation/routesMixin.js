/* global require, module */
module.exports = function(app, controllers) {
  //collection
  app.get('/api/:collection', controllers.retrieveAll);
  app.post('/api/:collection', controllers.updateAll);
  app.del('/api/:collection', controllers.deleteAll);
  //create element
  app.post('/api/:collection', controllers.create);
  //element
  app.get('/api/:collection/:id', controllers.retrieveOne);
  app.post('/api/:collection/:id', controllers.updateOne);
  app.del('/api/:collection/:id', controllers.deleteOne);

  // All undefined api routes should return a 404
  app.get('/*', function(req, res) {
    res.send(404);
  });
};
