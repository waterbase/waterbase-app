/* global require, module */
var ServerConfig = require('mongoose').model('ServerConfig');

module.exports = function(){
  ServerConfig.update({}, {
    $set:{
      'status.port': 0
    }
  });
}