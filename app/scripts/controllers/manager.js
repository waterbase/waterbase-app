'use strict';


angular.module('hackathonApp')
  .factory('requestServices', function($http) {
      var service = {
        currentCollection:'',
        getListOfCollections: function(callback) {
          $http.get('/API/database/' + 'testing')
            .success(function(data) {
              var data = _.pluck(data,'name');
              var data = _.map(data, function(element) {
                return element.split('.')[1];
              })
              var collections = _.filter(data, function(element) {
                return element !== "system";
              })
              callback(collections);
            })
        },
        getDocuments: function(callback) {
          $http.get('/api/database/testing/collection/' + this.currentCollection)
            .success(function(data) {
              callback(data);
            });
        },
        updateDocument: function(doc,id) {
          return $http.put('/api/database/testing/collection/' + this.currentCollection + '/id/' + id ,doc)
          .success(function() {
            console.log('document successfully updated');
          })
          .error(function() {
            console.log('document failed to update');
          });
        },
        deleteDocument: function(id) {
          return $http.delete('/api/database/testing/collection/' + this.currentCollection + '/id/' + id)
            .success(function() {
              console.log('document successfully deleted');
            })
            .error(function() {
              console.log('document could not be deleted');
            })
        },
        createDocument: function(doc) {
          $http.post('/api/database/testing/collection/' + this.currentCollection + '/id',doc)
            .success(function() {
              console.log('document successfully created!');
            })
        }
      }
      return service;
  });
