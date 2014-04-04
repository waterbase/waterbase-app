/* global module */
module.exports = function (resourceName, attributes, db) {

  var schema = new mongoose.Schema(attributes);

  db.model(resourceName, schema);
};
