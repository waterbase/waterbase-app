'use strict';

angular.module('hackathonApp')
  .factory('requestServices', function($http) {
      var service = {
        currentCollection:'',
        getListOfCollections: function(callback) {
          $http.get('/API/database/' + 'testing')
            .success(function(data) {
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
          $http.get('/api/database/testing/collection/' + this.currentCollection)
            .success(function(data) {
              callback(data);
            });
        },
        updateDocument: function(doc,id) {
          return $http.put('/api/database/testing/collection/' + this.currentCollection + '/id/' + id ,doc)
          .success(function() {
            console.log('document successfully updated');
          })
          .error(function() {
            console.log('document failed to update');
          });
        },
        deleteDocument: function(id) {
          return $http.delete('/api/database/testing/collection/' + this.currentCollection + '/id/' + id)
            .success(function() {
              console.log('document successfully deleted');
            })
            .error(function() {
              console.log('document could not be deleted');
            })
        },
        createDocument: function(doc) {
          $http.post('/api/database/testing/collection/' + this.currentCollection + '/id',doc)
            .success(function() {
              console.log('document successfully created!');
            })
        }
      }
      return service;
  });


angular.module('hackathonApp')
  .controller('ManagerCtrl', function ($scope,requestServices,$timeout) {

    $scope.temp = {};
    $scope.currentCollection = undefined;
    $scope.collectionData = [];
    $scope.animate = false;

    $scope.displayCollection = function(collection) {
      $scope.currentCollection = collection;
      requestServices.currentCollection = collection;
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

