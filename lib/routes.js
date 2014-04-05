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

  //direct database management
  app.get('/api/database/:database', middleware.auth, customDatabase.listCollections);
  app.del('/api/database/:database', middleware.auth, customDatabase.deleteCollection);
  //create collection
  app.post('/api/database/:database', middleware.auth, customDatabase.createCollection)
  //collection
  app.get('/api/database/:database/:collection', middleware.auth, customDatabase.list);
  app.put('/api/database/:database/:collection', middleware.auth, customDatabase.updateAll);
  app.del('/api/database/:database/:collection', middleware.auth, customDatabase.removeAll);
  //create document
  app.post('/api/database/:database/:collection', middleware.auth, customDatabase.createOne);
  //collection document
  app.get('/api/database/:database/:collection/:id', middleware.auth, customDatabase.show);
  app.put('/api/database/:database/:collection/:id', middleware.auth, customDatabase.updateOne);
  app.del('/api/database/:database/:collection/:id', middleware.auth, customDatabase.removeOne);


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
