'use strict';

angular.module('hackathonApp')
  .controller('NewApiCtrl', function ($scope, $http, $location) {
    $scope.resourceCount = 0;
    $scope.attributeCount = 0;
    $scope.api = {
      name: '',
      port: 0,
      resources: {}
    };
    $scope.errors = {};

    $scope.createApi = function () {
      $http.post('/api/servers', $scope.apiData).success(function(newApi) {

        console.log(newApi);
        $location.path('/dashboard');
      });
    };
  });
