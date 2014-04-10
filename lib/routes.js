'use strict';

var index = require('./controllers'),
    users = require('./controllers/users'),
    customDatabase = require('./controllers/customDatabase'),
    servers = require('./controllers/servers'),
    session = require('./controllers/session');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function (app) {
  // Server API Routes
  app.get('/api/servers', servers.list);
  app.get('/api/servers/:name', servers.show);
  app.post('/api/servers', servers.create);

  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);

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