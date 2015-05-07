'use strict';

angular.module('eHealth.locations.directives')
  .directive('selectedAdminDivision', function () {
    return {
      restrict: 'E',
      template: '{{ name }}',
      scope: {
        location: '=',
        placeholder: '@'
      },
      link: function postLink(scope) {
        var selected = scope.location.getInnermost();
        scope.name = selected ? selected.name : scope.placeholder;
      }
    };
  });
