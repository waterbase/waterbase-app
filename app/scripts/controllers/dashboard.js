'use strict';

angular.module('hackathonApp')
  .controller('DashboardCtrl', function ($scope, $http) {
    $http.get('/api/servers').success(function(servers) {
      $scope.servers = servers;

      $scope.servers.forEach(function (server) {
        Object.keys(server.resources).forEach(function (resource) {
          console.log(server.resources[resource]);
          server.resources[resource].description = '/' + resource + ': ';
          server.resources[resource].description += JSON.stringify(server.resources[resource].attributes);
        });
      });
    });
  });
