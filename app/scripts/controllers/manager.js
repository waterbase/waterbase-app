'use strict';




angular.module('hackathonApp')
  .service('requestServices', function($http){

      this.getListOfCollections = function(callback) {
        var self = this;
        $http.get('/API/database/testing')
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
      };
      this.getDocuments = function(collection, callback) {
        $http.get('/api/database/testing/collection/' + collection)
          .success(function(data) {
            callback(data);
          });
      };
      this.updateDocument = function(doc,id,callback) {
        return $http.put('/api/database/testing/collection/messages/id/' + id ,doc)
        .success(function() {
          console.log('document successfully updated');
        })
        .error(function() {
          console.log('document failed to update');
        });
      };
      this.deleteDocument = function(id) {
        return $http.delete('/api/database/testing/collection/messages/id/' + id)
          .success(function() {
            console.log('document successfully deleted');
          })
          .error(function() {
            console.log('document could not be deleted');
          })
      }
      this.createDocument = function(doc) {
        $http.post('/api/database/testing/collection/messages/id',doc)
          .success(function() {
            console.log('document successfully created!');
          })
      }
  });


angular.module('hackathonApp')
  .controller('ManagerCtrl', function ($scope,requestServices) {

    $scope.temp = {};
    $scope.currentCollection = undefined;
    $scope.collectionData = [];

    requestServices.getListOfCollections(function(collections) {
      $scope.collections = collections;
    });
    $scope.displayCollection = function(collection) {
      $scope.currentCollection = collection;
      requestServices.getDocuments(collection, function(documents) {
        $scope.collectionData = documents;
        $scope.collectionKeys = Object.keys($scope.collectionData[0]).sort();
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
      var id = doc._id
      requestServices.deleteDocument(id);
      $scope.displayCollection($scope.currentCollection);
    };
    $scope.saveDocument = function(value, key) {
      $scope.temp[key] = value;
    };
    $scope.updateDocument = function() {
      var id = $scope.temp._id;
      var doc = _.omit($scope.temp, '_id');
      $scope.temp = {}; // resets temp for next document
      return requestServices.updateDocument(doc,id);
    }

  });


