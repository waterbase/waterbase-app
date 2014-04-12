'use strict';

angular.module('waterbaseApp')
  .factory('ServerService', function($http){
    var service = {
      startServer: function (server) {
        return $http.post('api/servers/' + server._id + '/start');
      },
      stopServer: function (server) {
        return $http.post('api/servers/' + server._id + '/stop');
      },
      deleteServer: function (server) {
        var confirmDelete = confirm('Are you sure you wish to delete ' + server.name + '?');
        if (confirmDelete) {
          return $http.delete('api/servers/' + server._id);
        }
      },
    };
    return service;
  })
  .controller('DashboardCtrl', function($scope, $http, $route, ServerService) {
    $http.get('/api/servers').success(function(servers) {
      $scope.servers = servers;

      $scope.servers.forEach(function (server) {
        Object.keys(server.resources).forEach(function (resource) {
          server.resources[resource].description = '/' + resource + ': ';
          server.resources[resource].description += JSON.stringify(server.resources[resource].attributes);
        });
      });
    });

    // ServerService
    $scope.defaults = ServerService.defaults;
    $scope.deleteServer = function(server){
      ServerService.deleteServer(server).success(function () {
        // remove server from client view
        $scope.servers.splice($scope.servers.indexOf(server), 1);

        console.log('Server deleted');
      });
    };
    $scope.toggleServer = function(server){
      if (server.status.port) {
        ServerService.stopServer(server).success(function() {
          // refactor to use ng-show and ng-hide, look into loading gif, with on event listening and response end
          server.status.port = 0;
          console.log('Server stopped');
        });
      } else {
        ServerService.startServer(server).success(function() {
          // refactor to use ng-show and ng-hide, look into loading gif, with on event listening and response end
          server.status.port = 'pending';
          console.log('Server started');
          //$route.reload();
        });
      }
    };
  });
