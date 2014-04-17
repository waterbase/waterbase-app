'use strict';

angular.module('waterbaseApp')

  .controller('ManagerCtrl', function ($scope,databaseServices,$timeout,$routeParams) {

    $scope.currentCollection = undefined;
    $scope.currentDatabase =  $routeParams.server;
    $scope.currentDatabaseId = $routeParams.id;
    $scope.currentDocuments;
    $scope.collections;
    $scope.collectionKeys;
    $scope.temp = {};

    // set collection tabs using resources and attribute headers using schema
    databaseServices.getResources($scope.currentDatabaseId, function(resources) {
      // change keys to plural
      for (var key in resources) {
        if (pluralize(key) !== key) {
          resources[pluralize(key)] = _.cloneDeep(resources[key]);
          // delete original key
          delete resources[key];
        }
      }
      // set a default collection
      var keys = Object.keys(resources);
      $scope.currentCollection = keys[0];
      //
      var schema = resources[$scope.currentCollection].attributes;
      $scope.collectionKeys = Object.keys(schema).sort();
      $scope.collectionKeys.unshift('_id');
      schema['_id'] = '';
      $scope.collections = keys;
    });

    $scope.displayCollection = function(collection) {
      $scope.currentCollection = collection || $scope.currentCollection;
      databaseServices.getDocuments($scope.currentDatabase, $scope.currentCollection, function(documents) {
        $scope.currentDocuments = documents;
        $scope.collectionKeys = Object.keys(documents[0]);
        console.log($scope.collectionKeys);
      });
    };

    $scope.addDocument = function() {
      // create new blank document in database
      var blankDoc = {};
      _.each($scope.collectionKeys, function(key) {
        if (key !== '_id') {
          blankDoc[key] = '';
        }
      });
      databaseServices.createDocument($scope.currentDatabase, $scope.currentCollection, blankDoc);
      $scope.displayCollection();
    };
    $scope.deleteDocument = function(doc) {
      $timeout(function() {
        var id = doc._id
        databaseServices.deleteDocument($scope.currentDatabase, $scope.currentCollection, id);
        $scope.displayCollection();
      },500);
    };
    $scope.saveDocument = function(value, key, doc) {
      // saves all values for a single document in a temp
      $scope.temp[key] = value;
    };
    $scope.updateDocument = function() {
      var id = $scope.temp._id;
      var doc = _.omit($scope.temp, '_id');
      $scope.temp = {}; // resets temp for next document
      return databaseServices.updateDocument($scope.currentDatabase, $scope.currentCollection,doc,id);
    }
  });
