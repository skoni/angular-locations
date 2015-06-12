'use strict';

// this module is mainly used internally, but it also exposes picking
// locations for a specific country. i think that this feature will
// not be necessary and we will be able to eventually eliminate this
// module

describe('the locationsFactory service', function(){
  var locationsFactory;

  beforeEach(module('eHealth.locations'));
  beforeEach(inject(function(_locationsFactory_) {
    locationsFactory = _locationsFactory_;
  }));
  ['ml', 'lr', 'lr_clans', 'gn', 'gin', 'sl', 'mg'].forEach(function(code) {
    it('provides locations for '+code, function(){
      expect(locationsFactory(code)).toBeDefined();
    });
  });
});
