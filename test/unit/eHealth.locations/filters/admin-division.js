'use strict';

describe('Filter: adminDivision', function () {

  // load the filter's module
  beforeEach(module('eHealth.locations.filters'));

  // initialize a new instance of the filter before each test
  var adminDivision;
  beforeEach(module(function(locationsProvider) {
    locationsProvider.setCountryCode('ml');
  }));
  beforeEach(inject(function ($filter) {
    adminDivision = $filter('adminDivision');
  }));

  it('converts a location code to a location name', function () {
    expect(adminDivision('KD', 2)).toBe('Diéma');
  });
  it('ignores falsy values', function () {
    expect(adminDivision(undefined, 2)).toBe(undefined);
  });
});
