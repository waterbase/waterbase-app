'use strict';

angular.module('waterbaseApp')
  .controller('ManagerCtrl', function ($scope,databaseServices,$timeout,$routeParams) {
    $scope.currentCollection = undefined;
    $scope.currentServerId = $routeParams.id;
    $scope.currentDocuments;
    $scope.currentAttributes;
    $scope.collections;
    $scope.temp = {};

    // set collection tabs using resources and attribute headers using schema
    databaseServices.getResources($scope.currentServerId, function(resources) {
      // change keys to plural
      for (var key in resources) {
        if (pluralize(key) !== key) {
          resources[pluralize(key)] = _.cloneDeep(resources[key]);
          // delete original key
          delete resources[key];
          // change schema to attributes
        }
      }
      for (var key in resources) {
        var schema = resources[pluralize(key)].attributes;
        resources[key] = Object.keys(schema).sort();
        resources[key].unshift('_id');
      }
      $scope.collections = resources;
    });
    $scope.displayCollection = function(collection) {
      $scope.currentCollection = collection;
      databaseServices.getDocuments($scope.currentServerId, $scope.currentCollection, function(documents) {
        $scope.currentDocuments = documents;
        $scope.currentAttributes = $scope.collections[collection];
        console.log('current attributes: ', $scope.currentAttributes);
      });
    };
    $scope.addDocument = function() {
      // create new blank document in database
      var blankDoc = {};
      _.each($scope.currentAttributes, function(key) {
        if (key !== '_id') {
          blankDoc[key] = '';
        }
      });
      databaseServices.createDocument($scope.currentServerId, $scope.currentCollection, blankDoc);
      $scope.displayCollection($scope.currentCollection);
    };
    $scope.deleteDocument = function(doc) {
      var id = doc._id;
      databaseServices.deleteDocument($scope.currentServerId, $scope.currentCollection, id);
      $scope.displayCollection($scope.currentCollection);
    };
    $scope.saveDocument = function(value, key) {
      // saves all values for a single document in a temp
      $scope.temp[key] = value;
    };
    $scope.updateDocument = function() {
      var id = $scope.temp._id;
      var doc = _.omit($scope.temp, '_id');
      $scope.temp = {}; // resets temp for next document
      return databaseServices.updateDocument($scope.currentServerId, $scope.currentCollection,doc,id);
    };
    $scope.confirmDelete = function() {
      var prompt = confirm('Are you sure you want to delete this resource?');
      if (prompt) {
        return true;
      }
    };
  });
