'use strict';

describe('Service: locations', function () {

  // load the service's module
  beforeEach(module('eHealth.locations.services'));
  beforeEach(module(function(locationsProvider){
    locationsProvider.setCountryCode('ml');
  }));

  // instantiate service
  var locations,
      $log;
  beforeEach(inject(function (_locations_, _$log_) {
    locations = _locations_;
    $log = _$log_;
  }));
  it('has the expected name for the first level', function(){
    expect(locations[0].name).toBe('région');
  });
  it('decodes a specific code at a specific level', function(){
    expect(locations.decode('MM', 1)).toBe('Mopti');
  });
  it('does not log when called with undefined values', function(){
    spyOn($log, 'error');
    expect(locations.decode(undefined, 1)).toBe(undefined);
    expect($log.error).not.toHaveBeenCalled();
  });
});
