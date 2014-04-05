 'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  console.log(req.body);
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) {
      console.log(err);
      return res.send(400, err);
    }
    console.log('new user', newUser._id);
    req.logIn(newUser, function(err, info) {
      if (err) {
        return res.send(500, err);
      }
      return res.send(info);
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res) {
  var userId = req.params.id;
  console.log('looking for ', userId);
  User.findById(userId, function (err, user) {
    if (err) {
      res.send(500, err);
    }
    console.log(user);
    if (!user) {
      return res.send(404);
    }
    res.send(200, { profile: user.profile });
  });
};

/**
 * Change password
 */
exports.changePassword = function(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) {
          res.send(400);
        }
        res.send(200);
      });
    } else {
      res.send(401);
    }
  });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  console.log('=========me=====', req.user);
  console.log('=========session me=====', req.session.user);
  if (!req.user){
    res.send(404);
  }
  res.send(200, req.user);
};
