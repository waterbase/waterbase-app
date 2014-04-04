'use strict';

var app = angular.module('hackathonApp');

app.factory('ServerService', function($http){
  var defaults = {};
  
  var service = {
    startServer: function(server){
      return $http.post('api/servers/'+server._id+'/start');
    },
    stopServer: function(server){
      return $http.post('api/servers/'+server._id+'/stop');
    },
    deleteServer: function(server){
      var confirmDelete = confirm('Are you sure you wish to delete '+server.name+'?');
      if (confirmDelete) {
        return $http.delete('api/servers/'+server._id);
      }
    },
  };
  return service;
});

app.controller('DetailsCtrl', function($scope, $http, $route, ServerService) {

  $http.get('/api/servers').success(function(servers) {
    $scope.servers = servers;

    $scope.servers.forEach(function (server) {
      Object.keys(server.resources).forEach(function (resource) {
        console.log("server:",server);
        //server = {name:"",port="",url="",resources={}}
        console.log("server.resourses:", server.resources);
        //server.resources = {users="", messages="", rooms=""}
        //console.log(server.resources[resource]);
        server.resources[resource].description = '/' + resource + ': ';
        server.resources[resource].description += JSON.stringify(server.resources[resource].attributes);
      });
    });
  });
  // ServerService
  $scope.defaults = ServerService.defaults;
  $scope.deleteServer = function(server){
    ServerService.deleteServer(server).success(function() {
      // remove server from client view
      $scope.servers.splice($scope.servers.indexOf(server),1);
      console.log("Server deleted");
      // reload server list
      $route.reload();
    });
  }
  $scope.startServer = function(server){
    if (server.status.running) {
      ServerService.stopServer(server).success(function() {
        // refactor to use ng-show and ng-hide, look into loading gif, with on event listening and response end
        console.log("Server stopped")
        //$route.reload();
      });    
    } else {
      ServerService.startServer(server).success(function() {
        // refactor to use ng-show and ng-hide, look into loading gif, with on event listening and response end
        console.log("Server started")
        //$route.reload();
      });
    }
  }  
});
