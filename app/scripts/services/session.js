'use strict';

angular.module('waterbaseApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
