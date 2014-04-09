'use strict';

var index = require('./controllers'),
    users = require('./controllers/users'),
    servers = require('./controllers/servers'),
    session = require('./controllers/session');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

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

  // Collection Management
  app.get('/api/database/:database', middleware.auth, customDatabase.listCollections);
  app.get('/api/database/:database/:collection', middleware.auth, customDatabase.showCollection);)
  app.post('/api/database/:database', middleware.auth, customDatabase.createCollection)
  app.del('/api/database/:database/:collection', middleware.auth, customDatabase.deleteCollection);
  app.put('/api/database/:database/:collection', middleware.auth, customDatabase.renameCollection);

  // Document Management (All)
  app.get('/api/database/:database/collection/:collection', middleware.auth, customDatabase.listDocuments);
  app.del('/api/database/:database/collection/:collection', middleware.auth, customDatabase.deleteDocuments);

  // Document Management (Batch)
  app.put('/api/database/:database/collection/:collection/batch', middleware.auth, customDatabase.updateBatch);
  app.del('/api/database/:database/collection/:collection/batch', middleware.auth, customDatabase.deleteBatch);

  // Document Management (Individual)
  app.get('/api/database/:database/collection/:collection/id/:id', middleware.auth, customDatabase.showDocument);
  app.post('/api/database/:database/collection/:collection/id', middleware.auth, customDatabase.createDocument);
  app.del('/api/database/:database/collection/:collection/id/:id', middleware.auth, customDatabase.deleteDocument);
  app.put('/api/database/:database/collection/:collection/id/:id', middleware.auth, customDatabase.updateDocument);

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};