'use strict';

angular.module('eHealth.locations.filters')
  .filter('adminDivision', function (locations, $filter) {
    return function (id, level) {
      return locations.decode(id, level-1);
    };
  });
