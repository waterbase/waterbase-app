/* global require, module */

var index = require('./controllers');
var users = require('./controllers/users');
var serverConfigs = require('./controllers/serverConfigs');
var customDatabase = require('./controllers/customDatabase');
var session = require('./controllers/session');
var customDatabase = require('./controllers/customDatabase');
var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {
  //start and stop server
  app.post('/api/servers/:id/start', middleware.auth, serverConfigs.start);
  app.post('/api/servers/:id/stop', middleware.auth, serverConfigs.stop);
  //managing server config and schemas
  app.get('/api/servers', middleware.auth, serverConfigs.list);
  app.post('/api/servers', middleware.auth, serverConfigs.create);
  app.get('/api/servers/:id', middleware.auth, serverConfigs.show);
  app.put('/api/servers/:id', middleware.auth, serverConfigs.update);
  app.del('/api/servers/:id', middleware.auth, serverConfigs.remove);


  //users
  app.post('/api/users', users.create);
  app.put('/api/users', middleware.auth, users.changePassword);
  app.get('/api/users/me', middleware.auth, users.me);
  app.get('/api/users/:id', middleware.auth, users.show);

  //login and logout
  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);
  
  // List all collections of a database
  app.get('/api/database/:db', customDatabase.listCollections);

  // List all documents of a collection, create new document in collection
  app.get('/api/database/:db/:coll', customDatabase.listDocuments);
  app.post('/api/database/:db/:coll', customDatabase.createDocument);
  
  // Update, or delete document
  app.del('/api/database/:db/:coll/:id', customDatabase.deleteDocument);
  app.put('/api/database/:db/:coll/:id', customDatabase.updateDocument);

  // // Collection Management
  // app.get('/API/database/:database', customDatabase.listCollections);
  // app.get('/api/database/:database/:collection', customDatabase.showCollection);
  // app.post('/api/database/:database', customDatabase.createCollection);
  // app.del('/api/database/:database/:collection', customDatabase.deleteCollection);
  // app.put('/api/database/:database/:collection', customDatabase.renameCollection);

  // // Document Management (All)
  // app.get('/api/database/:database/collection/:collection', customDatabase.listDocuments);
  // app.del('/api/database/:database/collection/:collection', customDatabase.deleteDocuments);

  // // Document Management (Batch)
  // app.put('/api/database/:database/collection/:collection/batch', middleware.auth, customDatabase.updateBatch);
  // app.del('/api/database/:database/collection/:collection/batch', middleware.auth, customDatabase.deleteBatch);

  // // Document Management (Individual)
  // app.get('/api/database/:database/collection/:collection/id/:id', middleware.auth, customDatabase.showDocument);
  // app.post('/api/database/:database/collection/:collection/id', customDatabase.createDocument);
  // app.del('/api/database/:database/collection/:collection/id/:id', customDatabase.deleteDocument);
  // app.put('/api/database/:database/collection/:collection/id/:id', customDatabase.updateDocument);

  // All undefined api routes should return a 404
  app.get('/api/*', function (req, res) {
      res.send(404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};
