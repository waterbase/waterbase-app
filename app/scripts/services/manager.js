'use strict';

angular.module('waterbaseApp')
  .factory('databaseServices', function($http) {
      var service = {
        getListOfCollections: function(serverId,callback) {
          var extractCollections = function(data) {
            data = _.pluck(data,'name');
            data = _.map(data, function(element) {
              return element.split('.')[1];
            });
            var collections = _.filter(data, function(element) {
              return element !== 'system';
            });
            return collections;
          };
          $http.get('/api/servers/' + serverId + '/database/')
            .success(function(data) {
              var collections = extractCollections(data);
              console.log(data);
              callback(collections);
            });
        },
        getDocuments: function(serverId, collection, callback) {
          $http.get('/api/servers/' + serverId + '/database/' + collection)
            .success(function(data) {
              callback(data);
            });
        },
        getResources: function(serverId, callback) {
          $http.get('/api/servers/' + serverId)
            .success(function(data) {
              callback(data.resources);
            });
        },
        updateDocument: function(serverId, collection, doc, id) {
          return $http.put('/api/servers/' + serverId + '/database/' + collection + '/' + id, doc)
          .success(function() {
           })
          .error(function() {
          });
        },
        deleteDocument: function(serverId, collection, id) {
          return $http.delete('/api/servers/' + serverId +  '/database/' + collection + '/' + id)
            .success(function() {
            })
            .error(function(err) {
              console.log('failed to delete document, ', err);
            });
        },
        createDocument: function(serverId, collection, doc) {
          $http.post('/api/servers/' + serverId  + '/database/' + collection, doc)
            .success(function() {
          });
        }
      };
      return service;
    });