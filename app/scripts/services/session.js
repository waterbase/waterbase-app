'use strict';

angular.module('hackathonApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
