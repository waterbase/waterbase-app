'use strict';

angular.module('waterbaseApp')

  .factory('requestServices', function($http,$routeParams,ServerService) {
      var service = {
        currentCollection:'',
        currentDatabase: $routeParams.server,
        currentDatabaseId: $routeParams.id,
        currentResources: [],
        getListOfCollections: function(database,callback) {
          var extractCollections = function(data) {
            data = _.pluck(data,'name');
            data = _.map(data, function(element) {
              return element.split('.')[1];
            });
            var collections = _.filter(data, function(element) {
              return element !== "system";
            })
            return collections;
          };
          $http.get('/api/database/' + database)
            .success(function(data) {
              var collections = extractCollections(data);
              callback(collections);
            })
        },
        getDocuments: function(database, collection, callback) {
          $http.get('/api/database/' + database + '/' + collection)
            .success(function(data) {
              callback(data);
            });
        },
        getResources: function(databaseId, callback) {
          $http.get('/api/servers/' + databaseId)
            .success(function(data) {
              callback(data.resources);
            })
        },

        updateDocument: function(database, collection, doc,id) {
          return $http.put('/api/database/' + database + '/' + collection + '/' + id ,doc)
          .success(function() {
           })
          .error(function() {
          });
        },
        deleteDocument: function(database, collection, id) {
          return $http.delete('/api/database/' + database + '/' + collection + '/' + id)
            .success(function() {
            })
            .error(function(err) {
              console.log('failed to delete document, ', err);
            })
        },
        createDocument: function(database, collection, doc) {
          $http.post('/api/database/' + database + '/' + collection,doc)
            .success(function() {
            })
        }
      }
      return service;
  });


angular.module('waterbaseApp')
  .controller('ManagerCtrl', function ($scope,requestServices,$timeout,$routeParams) {


    $scope.currentCollection = undefined;
    $scope.currentDatabase =  $routeParams.server;
    $scope.currentDatabaseId = $routeParams.id;
    $scope.currentDocuments;
    $scope.collections;
    $scope.collectionKeys;
    $scope.temp = {};
    $scope.animate = false;

    requestServices.getListOfCollections($scope.currentDatabase,function(collections) {
      $scope.collections = collections;
    });

    $scope.displayCollection = function(collection) {
      $scope.currentCollection = collection || $scope.currentCollection;
      requestServices.getDocuments($scope.currentDatabase, $scope.currentCollection, function(documents) {
        $scope.currentDocuments = documents;
          // Retrieve schema keys to setup collection keys for table
          requestServices.getResources($scope.currentDatabaseId, function(resources) {
            var schema = resources[$scope.currentCollection].attributes;
            schema['_id'] = '';
            $scope.collectionKeys = Object.keys(schema).sort();
          });
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
      requestServices.createDocument($scope.currentDatabase, $scope.currentCollection, blankDoc);
      $scope.displayCollection();
    };
    $scope.deleteDocument = function(doc) {
      $timeout(function() {
        var id = doc._id
        requestServices.deleteDocument($scope.currentDatabase, $scope.currentCollection, id);
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
      return requestServices.updateDocument($scope.currentDatabase, $scope.currentCollection,doc,id);
    }



  });

