/* global require, module */
var express = require('express');

module.exports = function(app) {
  app.use(express.bodyParser());

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');

    next();
  });
};
