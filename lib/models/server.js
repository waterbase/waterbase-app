'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*

Server config file

 */
var ServerSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  url: String,
  port: {
    type: Number,
    unique: true
  },
  status: {
    running: Boolean,
  }
  resources: {},
  user_id: String
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

ServerSchema.methods = {
  generateURL: function(req) {
    this.url = req.headers.host + req.url + '/' + this.name;
  },

  start: function () {}
};

mongoose.model('Server', ServerSchema);
