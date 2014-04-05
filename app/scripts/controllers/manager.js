'use strict';

angular.module('hackathonApp')
  .factory('ManagerServices', function($http){
    var services ={
      getCollections : function(){
        $http.get('/api/servers/533f4e406ffe158c16d175d4').success(function(data){
          console.log('success:', data);
        });
      }
    };
    return services;

  })

  .controller('ManagerCtrl', function ($scope, ManagerServices) {

    $scope.collection = 'Users';

    $scope.collectionData = [
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
      {_id: 1, name: 'agchou', age: 27, notes:'hes da man!'},
    ];

    $scope.collectionKeys = Object.keys($scope.collectionData[0]);

    $scope.display = function() {
      ManagerServices.getCollections().success(function(){
        console.log('success!!!');
      });
    };
  });
