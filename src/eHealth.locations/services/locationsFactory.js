'use strict';

angular.module('eHealth.locations.services')
  .factory('locationsFactory', function(ml, gn, lr, sl) {
    var map = {
      ml: ml,
      gn: gn,
      gin: gn,
      lr: lr,
      sl: lr
    };
    return function(countryCode) {
      if (countryCode in map) {
        return map[countryCode];
      } else {
        var e = 'we have no location data for the country code `' +
              countryCode+'`';
        throw new Error(e);
      }
    }
  });
