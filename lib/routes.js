/* global require, module */

var index = require('./controllers');
var users = require('./controllers/users');
var serverConfigs = require('./controllers/serverConfigs');
var customDatabase = require('./controllers/customDatabase');
var herokuManager = require('./controllers/herokuManager');
var minionManager = require('./controllers/minionManager');
var session = require('./controllers/session');
var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {
  //minion management
  app.get('/minion/:id', minionManager.getConfig); //get serverConfig
  app.post('/minion/database/:id', minionManager.updateUri); //update databaseUri
  app.post('/minion/:id', minionManager.updateResource); //post resource
  app.put('/minion/:id', minionManager.updateResource); //put resource

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

  //database management
  app.get('/api/servers/:id/database/', customDatabase.listCollections);
  app.get('/api/servers/:id/database/:collection', customDatabase.listDocuments);
  app.post('/api/servers/:id/database/:collection', customDatabase.createDocument);
  app.del('/api/servers/:id/database/:collection/:documentId', customDatabase.deleteDocument);
  app.put('/api/servers/:id/database/:collection/:documentId', customDatabase.updateDocument);

  // All undefined api routes should return a 404
  app.get('/api/*', function (req, res) {
      res.send(404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};
