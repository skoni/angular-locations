'use strict';

// a selected location is a stateful object created from a country
// locations. for every level in the country location, the selected
// location remembers what we selected, and it automatically updates
// locations in the contained levels

var testLocationData = [{
  depth: 0,
  name: 'Zero',
  items: [{
    name: 'a',
    id: 1
  }, {
    name: 'b',
    id: 2
  }]
}, {
  depth: 1,
  name: 'One',
  items: [{
    name: 'a a',
    id: 1,
    parentId: 1
  }, {
    name: 'b b',
    id: 2,
    parentId: 2
  }]
}, {
  depth: 2,
  items: [{
    name: 'a a',
    id: 1,
    parentId: 1
  }, {
    name: 'b b b',
    id: 2,
    parentId: 2
  }]
}];

describe('Service: SelectedLocationFactory', function () {

  // load the service's module
  beforeEach(module('eHealth.locations.services'));

  // instantiate service
  var selectedLocationFactory;
  beforeEach(module(function(locationsProvider) {
    locationsProvider.setCountryCode('ml');
  }));
  beforeEach(inject(function (_selectedLocationFactory_) {
    selectedLocationFactory = _selectedLocationFactory_;
  }));

  describe('a location', function() {
    var location;
    beforeEach(function() {
      location = selectedLocationFactory({
        locationsData: testLocationData
      });
    });
    it('provides iterable levels', function() {
      expect(location.levels.forEach).toBeDefined();
      expect(location.levels.length).toBe(3);
    });
    it('selects levels above when the deeper one is selected', function () {
      // this funny interface in actually convenient in the templates,
      // in order to bind `selected` with a model and `update` with an
      // `ngChange` directive
      var level = location.levels[2];
      level.selected = level.items[0];
      level.update();
      expect(location.levels[0].selected.id).toBe(1);
      expect(location.levels[1].selected.id).toBe(1);
      expect(location.levels[2].selected.id).toBe(1);
    });
    it('supports a simpler interface', function () {
      location.select(2, 1);
      expect(location.levels[0].selected.id).toBe(1);
      expect(location.levels[1].selected.id).toBe(1);
      expect(location.levels[2].selected.id).toBe(1);
    });
    it('restricts levels below when the topmost is selected', function() {
      var level = location.levels[0];
      level.selected = level.items[0];
      level.update();
      expect(location.levels[0].items.length).toBe(2);
      expect(location.levels[1].items.length).toBe(1);
      expect(location.levels[1].selected).toBeUndefined()
      expect(location.levels[2].items.length).toBe(1);
      expect(location.levels[1].selected).toBeUndefined()
    });
    it('unselects levels below if conflicting with the parent', function() {
      location.levels[1].selected = { id: 2};
      location.levels[0].selected = { id: 1};
      location.levels[0].update();
      expect(location.levels[1].selected).toBeUndefined();
    });
    it('keeps levels below if compatible with the parent', function() {
      location.levels[1].selected = {id: 1};
      location.levels[0].selected = {id: 1};
      location.levels[0].update();
      expect(location.levels[1].selected.id).toBe(1);
    });
    it('throws an error when selecting not existing ids', function() {
      expect(function() {
        location.level[1].selectBy('bullshit');
      }).toThrow();
    });
    it('can clone itself and compare', function() {
      var cloned = location.clone();
      expect(cloned.compare(location)).toBe(true);
    });
    it('can clone itself and compare also selected items', function() {
      location.levels[0].selected = location.levels[0].items[0];
      var cloned = location.clone();
      expect(cloned.compare(location)).toBe(true);
      expect(location.levels[0].selected).toEqual(cloned.levels[0].selected);
    });

    describe('with all-items', function() {
      var locsWithAll;

      beforeEach(function() {
        locsWithAll = selectedLocationFactory({
          locationsData: testLocationData,
          hasAllItem: true
        });
      });
      it('has all-items on each level as first element', function() {
        expect(locsWithAll.levels[0].items[0].isAll);
        expect(locsWithAll.levels[1].items[0].isAll);
        expect(locsWithAll.levels[2].items[0].isAll);
      });
      it('should select child-level all-items on parent change', function() {
        locsWithAll.levels[1].selected = locsWithAll.levels[1].items[1];
        locsWithAll.levels[0].selected = locsWithAll.levels[0].items[1];
        locsWithAll.levels[0].update();
        expect(locsWithAll.levels[1].selected.isAll);
      });
    });
  });
  describe('a location without options', function(){
    var location;
    beforeEach(function(){
      location = selectedLocationFactory();
    });
    it('runs without errors', function(){
      expect(function(){
        location = selectedLocationFactory();
      }).not.toThrow();
    });
    it('has the expected properties', function(){
      expect(location.levels).toBeDefined();
      expect(location.select).toBeDefined();
    });
    it('gets country location data from the `locations` service', function(){
      expect(location.levels.length).toBe(3);
    });
  });
});
