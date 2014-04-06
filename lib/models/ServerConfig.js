 'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*

Server config file

 */
var ServerSchema = new Schema({
  name: String,
  user: String,
  status: {
    port: Number,
    running: Boolean,
  },
  resources: {}
});

// Public profile information
ServerSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'port': this.port
    };
  });

ServerSchema
  .virtual('id')
  .get(function() {
    return this._id;
  });

//validation
ServerSchema
  .path('name')
  .validate(function(value, respond) {
    if (value.length === 0){
      return respond(false);
    } else {
      return respond(true);
    }
}, 'The specified server name is empty');

ServerSchema
  .path('name')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({name: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified server name is already in use.');


//
ServerSchema.methods = {
  generateURL: function(req) {
    this.url = req.headers.host + req.url + '/' + this.name;
  },

  start: function () {}
};

module.exports = mongoose.model('ServerConfig', ServerSchema);
