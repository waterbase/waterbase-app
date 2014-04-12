'use strict';

angular.module('waterbaseApp')
  .controller('NewApiCtrl', function ($scope, $http, $location) {
    $scope.resourceCount = 0;
    $scope.attributeCount = 0;
    $scope.api = {
      name: '',
      port: 0,
      resources: {}
    };
    $scope.errors = {};

    // $scope.createApi = function () {
    //   $http.post('/api/servers', $scope.apiData).success(function(newApi) {

    //     $location.path('/dashboard');
    //   });
    // };
  });

angular.module('waterbaseApp')
  .controller('newApiController', ['$scope', '$http', '$location', function($scope,$http,$location) {
    $scope.resources = [{resourceName: '', attributes: [{name:'', type:''}]}];
    $scope.createNewField = function() {
      var resource = {resourceName: '', attributes: [{name:'', type:''}]};
      $scope.resources.push(resource);
    };
    $scope.createSubField = function(attributes) {
      attributes.push({name:'', type:''});
    };
    $scope.removeField = function(resource) {
      var index = $scope.resources.indexOf(resource);
      $scope.resources.splice(index,1);
    };
    $scope.removeSubField = function(attributes,attribute) {
      var index = attributes.indexOf(attribute);
      attributes.splice(index,1);
    };
    var createJsonConfig = function (arr) {
      var jsonConfig = {};

      jsonConfig.name = $scope.serverName;
      jsonConfig.port = $scope.portNum;

      jsonConfig.resources = {};
      for ( var i = 0; i < arr.length; i++ ) {
        var resource = jsonConfig.resources[arr[i].resourceName] = {};
        resource.attributes = {};
        resource.methods = ['list', 'create','show'];

        for ( var j = 0; j < arr[i].attributes.length; j++ ) {
          var attribute = arr[i].attributes[j];
          resource.attributes[attribute.name] = attribute.type;
        }
      }
      return jsonConfig;
    };

    $scope.submitForm = function() {
      var jsonConfig = createJsonConfig($scope.resources);
      $http.post('/api/servers',jsonConfig)
        .success(function(res) {
          // add spinner
          console.log(res);
          $location.path('/dashboard');
        });
    };
    // post jsonConfig file
  }]);
