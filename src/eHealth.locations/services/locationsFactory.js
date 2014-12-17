'use strict';

angular.module('eHealth.locations.services')
  .factory('locationsFactory', function($log, ml, gn, lr, sl) {
    var map = {
      ml: ml,
      gn: gn,
      gin: gn,
      lr: lr,
      sl: lr
    };
    return function(countryCode) {
      if (countryCode in map) {
        var locations = map[countryCode],
            indexes = [];
        indexes = locations.map(function(level) {
          var index = {};
          level.items.forEach(function(item) {
            index[item.id] = item;
          });
          return index;
        });
        locations.decode = function(code, l) {
          var level = indexes[l];
          if (level) {
            if (level[code]) {
              return level[code].name;
            } else {
              $log.error('we cannot find code '+code+' in locations level '+
                         locations[l].name);
            }
          } else {
            $log.error(countryCode+' locations have only '+indexes.length+
                  ' levels');
          }
        };
        return locations;
      } else {
        var e = 'we have no location data for the country code `' +
              countryCode+'`';
        throw new Error(e);
      }
    };
  });
