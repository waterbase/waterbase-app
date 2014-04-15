'use strict';

angular.module('waterbaseApp')
    .factory('ServerService', function($http){
    var service = {
      getServers: function () {
        return $http.get('/api/servers');
      },
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
  });