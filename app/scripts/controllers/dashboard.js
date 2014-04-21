'use strict';

angular.module('waterbaseApp')
  .controller('DashboardCtrl', function($scope, $http, $route, $q, ServerService) {

    $scope.getServers = function() {
      ServerService.getServers().success(function(servers) {
        $scope.servers = servers;
        $scope.servers.forEach(function (server) {
          Object.keys(server.resources).forEach(function(resource) {
            server.resources[resource].description = '/' + resource + ': ';
            server.resources[resource].description += JSON.stringify(server.resources[resource].attributes);
          });
        });
      });
    };

    // ServerService
    $scope.deleteServer = function(server){
      ServerService.deleteServer(server).success(function() {
        // remove server from client view
        $scope.servers.splice($scope.servers.indexOf(server), 1);

        console.log('Server deleted');
      });
    };

    $scope.toggleServer = function(server){
      if (server.status.running) {
        ServerService.stopServer(server).success(function() {
          $scope.getServers();
          console.log('Server stopped');
        });
      } else {
        ServerService.startServer(server).success(function() {
          $scope.getServers();
        });
      }
    };

    $scope.getServers();
  });
