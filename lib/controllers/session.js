'use strict';

var passport = require('passport');

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  res.send(204);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) {
      return res.json(401, error);
    }

    req.logIn(user, function(err) {
      if (err) {
        return res.send(err);
      }
      res.send(201, {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        provider: req.user.provider
      });
    });
  })(req, res, next);
};
