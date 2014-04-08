'use strict';

angular.module('hackathonApp')
  .factory('ServerService', function ($http) {
    var service = {
      startServer: function (server){
        return $http.post('api/servers/'+server._id+'/start');
      },
      stopServer: function (server){
        return $http.post('api/servers/'+server._id+'/stop');
      },
      deleteServer: function (server){
        var confirmDelete = confirm('Are you sure you wish to delete '+server.name+'?');
        if (confirmDelete) {
          return $http.delete('api/servers/'+server.id);
        }
      }
    }
    return service;
  })

  .controller('DashboardCtrl', function ($scope, $http, $route, ServerService) {
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
    
    $scope.startServer = function (server) {
      if (server.status.running) {
        ServerService.stopServer(server).success(function() {
          console.log('Server stopped');
        })
      } else {
        ServerService.startServer(server).success(function() {
          console.log('Server started');
        })
      }
    };

    $scope.deleteServer = function (server) {
      ServerService.deleteServer(server).success(function() {
        $scope.servers.splice($scope.servers.indexOf(server), 1);
        console.log('Server deleted');
        $route.reload();
      })
    };
  });
