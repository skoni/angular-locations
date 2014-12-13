'use strict';

describe('Service: locations', function () {

  // load the service's module
  beforeEach(module('eHealth.locations.services'));
  beforeEach(module(function(locationsProvider){
    locationsProvider.setCountryCode('ml');
  }));

  // instantiate service
  var locations;
  beforeEach(inject(function (_locations_) {
    locations = _locations_;
  }));
  it('has the expected name for the first level', function(){
    expect(locations[0].name).toBe('région');
  });
});
