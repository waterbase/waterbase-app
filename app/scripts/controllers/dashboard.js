'use strict';

angular.module('waterbaseApp')
  .controller('DashboardCtrl', function($scope, $http, $route, $q, ServerService) {

    $scope.getServers = function() {
      ServerService.getServers().success(function(servers) {
        $scope.servers = servers;
        console.log("dsfd", $scope.servers);
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
      if (server.status.port) {
        ServerService.stopServer(server).success(function() {
          server.status.port = 0;
          console.log('Server stopped');
        });
      } else {
        server.status.port = 'Pending...';
        ServerService.startServer(server).success(function() {
          $scope.getServers();
        });
      }
    };

    $scope.getServers();
  });
