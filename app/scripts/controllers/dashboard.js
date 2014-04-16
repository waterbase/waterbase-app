'use strict';

angular.module('waterbaseApp')
  .controller('DashboardCtrl', function($scope, $http, $route, ServerService) {

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

    $scope.getServers();

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
        ServerService.startServer(server).success(function() {
          //server.status.port = 'pending';
          $scope.getServers();
          console.log('Server started');
          //$route.reload();
        });
      }
    };
  });
