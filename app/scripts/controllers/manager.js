'use strict';

angular.module('waterbaseApp')

  .factory('requestServices', function($http,$routeParams) {
      var service = {
        currentCollection:'',
        currentDatabase: $routeParams.database,
        getListOfCollections: function(callback) {
          $http.get('/API/database/' + this.currentDatabase)
            .success(function(data) {
              console.log(data);
              var data = _.pluck(data,'name');
              var data = _.map(data, function(element) {
                return element.split('.')[1];
              })
              var collections = _.filter(data, function(element) {
                return element !== "system";
              })
              callback(collections);
            })
        },
        getDocuments: function(callback) {
          $http.get('/api/database/' + this.currentDatabase + '/' + this.currentCollection)
            .success(function(data) {
              callback(data);
            });
        },
        updateDocument: function(doc,id) {
          return $http.put('/api/database/' + this.currentDatabase + '/' + this.currentCollection + '/' + id ,doc)
          .success(function() {
            console.log('document successfully updated');
          })
          .error(function() {
            console.log('document failed to update');
          });
        },
        deleteDocument: function(id) {
          return $http.delete('/api/database/' + this.currentDatabase + '/' + this.currentCollection + '/' + id)
            .success(function() {
              console.log('document successfully deleted');
            })
            .error(function() {
              console.log('document could not be deleted');
            })
        },
        createDocument: function(doc) {
          $http.post('/api/database/' + this.currentDatabase + '/' + this.currentCollection,doc)
            .success(function() {
              console.log('document successfully created!');
            })
        }
      }
      return service;
  });


angular.module('waterbaseApp')
  .controller('ManagerCtrl', function ($scope,requestServices,$timeout) {

    $scope.temp = {};
    $scope.currentCollection = undefined;
    $scope.currentDatabase = undefined;
    $scope.collectionData = [];
    $scope.animate = false;

    $scope.displayCollection = function(collection) {
      $scope.currentCollection = collection;
      requestServices.currentCollection = collection;
      $scope.currentDatabase = requestServices.currentDatabase;
      requestServices.getDocuments(function(documents) {
        $scope.collectionData = documents;
        if ($scope.collectionData.length > 0) {
          $scope.collectionKeys = Object.keys($scope.collectionData[0]).sort();
        }
      });
    };
    $scope.addDocument = function() {
      // create new blank document in database
      var keys = Object.keys($scope.collectionData[0])
      var blankDoc = {};
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== '_id') {
          blankDoc[keys[i]] = '';
        }
      }
      requestServices.createDocument(blankDoc);
      $scope.displayCollection($scope.currentCollection);
    };
    $scope.deleteDocument = function(doc) {
      $timeout(function() {
        var id = doc._id
        requestServices.deleteDocument(id);
        $scope.displayCollection($scope.currentCollection);
      },500);
    };
    $scope.saveDocument = function(value, key, doc) {
      $scope.temp[key] = value;
    };
    $scope.updateDocument = function() {
      var id = $scope.temp._id;
      var doc = _.omit($scope.temp, '_id');
      $scope.temp = {}; // resets temp for next document
      return requestServices.updateDocument(doc,id);
    }

    requestServices.getListOfCollections(function(collections) {
      $scope.collections = collections;
      console.log(collections);
    });

  });

