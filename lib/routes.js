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
  app.del('/api/servers/:_id', servers.delete);
  // add routes for starting and stopping servers

  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);

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