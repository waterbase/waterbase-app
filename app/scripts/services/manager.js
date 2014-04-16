angular.module('waterbaseApp')
  .factory('databaseServices', function($http,$routeParams) {
      var service = {
        getListOfCollections: function(database,callback) {
          var extractCollections = function(data) {
            data = _.pluck(data,'name');
            data = _.map(data, function(element) {
              return element.split('.')[1];
            });
            var collections = _.filter(data, function(element) {
              return element !== "system";
            })
            return collections;
          };
          $http.get('/api/database/' + database)
            .success(function(data) {
              var collections = extractCollections(data);
              console.log(data);
              callback(collections);
            })
        },
        getDocuments: function(database, collection, callback) {
          $http.get('/api/database/' + database + '/' + collection)
            .success(function(data) {
              callback(data);
            });
        },
        getResources: function(databaseId, callback) {
          $http.get('/api/servers/' + databaseId)
            .success(function(data) {
              callback(data.resources);
            })
        },
        updateDocument: function(database, collection, doc,id) {
          return $http.put('/api/database/' + database + '/' + collection + '/' + id ,doc)
          .success(function() {
           })
          .error(function() {
          });
        },
        deleteDocument: function(database, collection, id) {
          return $http.delete('/api/database/' + database + '/' + collection + '/' + id)
            .success(function() {
            })
            .error(function(err) {
              console.log('failed to delete document, ', err);
            })
        },
        createDocument: function(database, collection, doc) {
          $http.post('/api/database/' + database + '/' + collection,doc)
            .success(function() {
            })
        }
      }
      return service;
  });