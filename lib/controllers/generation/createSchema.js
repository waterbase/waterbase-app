/* global module */
var mongoose = require('mongoose');
module.exports = function (name, detail, db) {
  console.log('creating schema for ', name);
  var schema = new mongoose.Schema(detail.resouces);
  schema.virtual('id').get(function(){
    return this._id;
  });
  if (detail){
    //TODO attach password and hashing to
  }
  db.model(name, schema);
};
