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
        var self = this;
        $http.get('/api/database/testing/collection/' + collection)
          .success(function(data) {
            callback(data);
          });
      };
      this.updateDocument = function(document) {
        var id = document._id;
        var doc = _.omit(document, '_id');
        console.log(doc);
        $http.put('/api/database/testing/collection/messages/id/' + id ,doc)
        .success(function(data) {
          console.log('document successfully updated: ',data)
        })
      };
  });


angular.module('hackathonApp')
  .controller('ManagerCtrl', function ($scope,requestServices) {

    $scope.temp = {};
    requestServices.getListOfCollections(function(collections) {
      $scope.collections = collections;
    });

    $scope.currentCollection = undefined;
    $scope.collectionData = [];

    $scope.displayCollection = function(collection) {
      // requestServices.getCollections(function(data){
      //   $scope.collectionData = data;
      // })
      $scope.currentCollection = collection;
      requestServices.getDocuments(collection, function(documents) {
        $scope.collectionData = documents;
        $scope.collectionKeys = Object.keys($scope.collectionData[0]).sort();
      });
    };

    $scope.addDocument = function() {
      // properties found from database
      var newDocument = {};
      for (var key in $scope.collectionKeys) {
        var value = $scope.collectionKeys[key];
        console.log(value);
        if (value === '_id') {
          newDocument['_id'] =  1; // increment using last value in current collectionData
        } else {
          newDocument[value] = '';
        }
      }
      $scope.collectionData.push(newDocument);
    };
    $scope.deleteDocument = function(index) {
      $scope.collectionData.splice(index,1);
    };
    $scope.deleteCollection = function() {
      // DELETE /api/database/:id/:collection
      // switch to another collection
    };


    $scope.saveDocument = function(document, key) {
      $scope.temp[key] = document;
    };
    $scope.updateDocument = function() {
      requestServices.updateDocument(document);
    }
    $scope.show = function(collection) {
      console.log(collection);
    }


  });


