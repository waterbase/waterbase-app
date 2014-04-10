'use strict';


    // $http.post('/api/database/super/collection/users/id',
    // {documents: { name: 'agchou', age: 27, notes:'hes da man!'}})
    //   .success(function(data){
    //     console.log(data);
    //   });

    // user collection name to get documents



angular.module('hackathonApp')
  .service('requestServices', function($http){

      // getCollection : function(collection,callback){
      //   $http.get('/api/database/:collection')
      //     .success(function(data){
      //       callback(data);
      //     });
      // },
      // postCollections : function(callback) {
      //   $http.post('/api/database/533f4e406ffe158c16d175d4');
      // }
      this.getListOfCollections = function(callback) {
        var self = this;
        $http.get('/API/database/super')
          .success(function(data) {
            var data = _.pluck(data,'name');
            var data = _.map(data, function(element) {
              return element.split('.')[1];
            })
            var collections = _.filter(data, function(element) {
              return element !== "system";
            })
            self.collections = collections;
            callback();
          })
      };
      this.getDocuments = function(collection, callback) {
        var self = this;
        $http.get('/api/database/super/collection/' + collection)
          .success(function(data) {
            callback(data);
          });
      };
  });

angular.module('hackathonApp')
  .controller('ManagerCtrl', function ($scope,requestServices) {


    requestServices.getListOfCollections(function() {
      $scope.collections = requestServices.collections;
    });



    $scope.currentCollection = undefined;
    $scope.collectionData = [];
    var dummies = {};
    dummies['users'] = [{_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
    ];
    dummies['messages'] = [{_id: 1, awesomeness: 'charles', age: 27, notes:'hes da man!'},
      {_id: 1, awesomeness: 'charles', age: 27, notes:'hes da shit!'},
      {_id: 1, awesomeness: 'charles', age: 27, notes:'hes da shit!'},
      {_id: 1, awesomeness: 'charles', age: 27, notes:'hes da shit!'},
      {_id: 1, awesomeness: 'charles', age: 27, notes:'hes da shit!'},
      {_id: 1, awesomeness: 'charles', age: 27, notes:'hes da shit!'},
    ];



    $scope.displayCollection = function(collection) {
      // requestServices.getCollections(function(data){
      //   $scope.collectionData = data;
      // })
      console.log($scope.collections);
      $scope.currentCollection = collection;
      requestServices.getDocuments(collection, function(documents) {
        $scope.collectionData = documents;
        $scope.collectionKeys = Object.keys($scope.collectionData[0]);
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

    $scope.saveChanges = function() {
      // Sends entire collection back
      // POST /api/database/:id/:collection
    };



  });


