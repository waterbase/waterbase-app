/* global module */
var mongoose = require('mongoose');
module.exports = function (name, detail, db) {
  console.log('updating schema for ', name);
  var schema = new mongoose.Schema();
  schema.virtual('id').get(function(){
    return this._id;
  });
  //attach non-existing attributes
  for (var attribute in detail.attribute){
    if (!detail.attribute.hasOwnProperty(attribute)){
      schema.add(detail.attribute[attribute]);
    }
  }
  if (detail){
    //TODO attach password and hashing to
  }
  //crete the model if it doesnt exist
  if (!db.model(name)){
    db.model(name, schema);
  }
  return schema;
};
