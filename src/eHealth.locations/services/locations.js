'use strict';

angular.module('eHealth.locations.services')
  .provider('locations', function() {
    var countryCode;
    this.setCountryCode = function(_countryCode_) {
      countryCode = _countryCode_;
    };
    this.$get = ['locationsFactory', function(locationsFactory) {
      if (countryCode) {
        return locationsFactory(countryCode);
      } else {
        var e = 'a country code needs to be set via the locationsProvider.' +
              ' currently the country code is `'+
              JSON.stringify(countryCode)+'`';
        throw new Error(e);
      }
    }];
  });
