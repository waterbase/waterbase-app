'use strict';

angular.module('hackathonApp')

  .controller('ManagerCtrl', function ($scope) {
    $scope.collections = ['users','messages'];
    $scope.currentCollection;
    $scope.collectionData = [];
    var dummies = {}
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

    $scope.getListOfCollections = function() {
      // requestServices.getListOfCollections(function(data){
          // $scope.collections = data;
      // })

    };

    $scope.displayCollection = function(collection) {
      // requestServices.getCollections(function(data){
      //   $scope.collectionData = data;
      // })
      console.log(collection);
      $scope.currentCollection = collection;
      $scope.collectionData = dummies[collection];
      console.log($scope.collectionData);
      $scope.collectionKeys = Object.keys($scope.collectionData[0]);
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


  // .factory('requestServices', function($http){
  //   var services = {
  //     getCollection : function(collection,callback){
  //       $http.get('/api/database/:collection')
  //         .success(function(data){
  //           callback(data);
  //         });
  //     },
  //     postCollections : function(callback) {
  //       $http.post('/api/database/533f4e406ffe158c16d175d4');
  //     }
  //     getListOfCollections: function(callback) {
  //       $http.get('/api/database/:id');
  //     }
  //   };
  //   return services;
  // })