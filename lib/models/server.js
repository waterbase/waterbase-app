'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Api Schema
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
  resources: {},
  user_id: String
});

/**
 * Virtuals
 */

// Public profile information
ServerSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'port': this.port
    };
  });

/**
 * Validations
 */
// ServerSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

/**
 * Post-save hook
 */

// ServerSchema
//   .post('save', function(next) {
//     if (!this.isNew) return next();

//     if (!validatePresenceOf(this.url))
//       this.url = this.generateURL(req, this.id);
//     else
//       next();
//   });


/**
 * Methods
 */
ServerSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  generateURL: function(req) {
    this.url = req.headers.host + req.url + '/' + this.name;
  },

  start: function () {}
};

mongoose.model('Server', ServerSchema);
