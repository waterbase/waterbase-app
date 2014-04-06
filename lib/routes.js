/* global require, module */

var index = require('./controllers'),
    users = require('./controllers/users'),
    serverConfigs = require('./controllers/serverConfigs'),
    session = require('./controllers/session');
var customDatabase = require('./controllers/customDatabase');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {
  //managing server config and schemas
  app.get('/api/servers', middleware.auth, serverConfigs.list);
  app.post('/api/servers', middleware.auth, serverConfigs.create);
  app.get('/api/servers/:id', middleware.auth, serverConfigs.show);
  app.put('/api/servers/:id', middleware.auth, serverConfigs.update);
  app.del('/api/servers/:id', middleware.auth, serverConfigs.remove);

  //start and stop server 
  app.post('/api/servers/:id/start', middleware.auth, serverConfigs.start);
  app.post('/api/servers/:id/stop', middleware.auth, serverConfigs.stop);

  // Collection Management
  app.get('/api/database/:database', middleware.auth, customDatabase.listCollections);
  app.get('/api/database/:database/:collection', middleware.auth, customDatabase.showCollection);)
  app.post('/api/database/:database', middleware.auth, customDatabase.createCollection)
  app.del('/api/database/:database/:collection', middleware.auth, customDatabase.deleteCollection);
  app.put('/api/database/:database/:collection', middleware.auth, customDatabase.renameCollection)
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

  //user management
  app.post('/api/users', middleware.auth, users.create);
  app.put('/api/users', middleware.auth, users.changePassword);
  app.get('/api/users/me', middleware.auth, users.me);
  app.get('/api/users/:id', middleware.auth, users.show);

  //login and logout
  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};
