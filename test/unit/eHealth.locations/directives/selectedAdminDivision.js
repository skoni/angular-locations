'use strict';

describe('Directive: selected-admin-division', function () {

  beforeEach(module('eHealth.locations.directives'));

  beforeEach(module(function(locationsProvider) {
    locationsProvider.setCountryCode('lr');
  }));

  var element,
      scope,
      $compile;

  function fakeElement() {
    return angular.element(
      '<selected-admin-division location="location"></selected-admin-division>'
    );
  }

  function fakeScope($rootScope) {
    var s = $rootScope.$new();
    s.location = fakeLocation();
    return s;
  }

  function fakeLocation() {
    return {
      getInnermost: jasmine.createSpy().andReturn(null)
    };
  }

  beforeEach(inject(function ($rootScope, _$compile_) {
    element = fakeElement();
    scope = fakeScope($rootScope);
    $compile = _$compile_;
  }));

  function render() {
    $compile(element)(scope);
    scope.$digest();
  }

  it('renders name of currently selected admin division', function () {
    scope.location.getInnermost.andReturn({name: 'Grand Gedeh'});
    render();
    expect(element.text()).toBe('Grand Gedeh');
  });

  it('is empty when there is no selection', function () {
    scope.location.getInnermost.andReturn(null);
    render();
    expect(element.text()).toBe('');
  });

  it('uses provided placeholder text for empty selection', function () {
    element.attr('placeholder', 'All Divisions');
    scope.location.getInnermost.andReturn(null);
    render();
    expect(element.text()).toBe('All Divisions');
  })
});
