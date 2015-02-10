'use strict';

angular.module('eHealth.locations.services')
  .factory('selectedLocationFactory', function (locations, $log) {

    // Restrict locations. This originally leveraged lodash/underscore _.filter
    // & _.find functions, as lodash/underscore is not available in this
    // project, and while we can't rely on native implenetations accross
    // different environements just yet, and in the name of keeping things lean
    // and performant (at the price of readability / cleanliness), we'll do
    // this the ugly way
    function restrictLocations(locations, restrictions, level) {
      var restrictedLocations = [];
      for (var locationsIndex=0; locationsIndex < locations.length; locationsIndex++) {
        var location = locations[locationsIndex];
        for (var restrictionsIndex=0; restrictionsIndex < restrictions.length; restrictionsIndex++) {
          var restriction = restrictions[restrictionsIndex];
          if (restriction.name === location.name && restriction.id === location.id && restriction.level === level) {
            restrictedLocations.push(locations[locationsIndex]);
          }
        }
      }
      return restrictedLocations;
    }

    function create(options) {
      options = options || {};
      var hasAllItem = options.hasAllItem,
          locationsData = options.locationsData || locations,
          original = angular.copy(locationsData),
          levels = [],
          location;

      function reset(index) {
        var level = angular.copy(original[index]);
        if (hasAllItem) {
          // adds an all-item.
          // The all-item will be automatically selected when there is not
          // a more narrow selection for this level or a child level
          var allItem = {
            isAll: true,
            name: 'all'
          };
          level.items.unshift(allItem);
          level.selected = allItem;
        }
        level.original = angular.copy(level);
        level.byId = {};

        level.items.forEach(function(item) {
          level.byId[item.id] = item;
        });
        level.selectById = function(id) {
          var match = level.byId[id];
          if (match) {
            level.selected = level.byId[id];
          } else {
            throw new Error('id '+id+' in not in level '+level.name);
          }
        };
        function updateUp(selected, depth) {
          if (depth < 0 || selected.isAll) {
            return;
          }
          reset(depth);
          levels[depth].selectById(selected.parentId);
          updateUp(levels[depth].selected, depth - 1);
        }
        function updateDown(selected, depth) {
          var level = levels[depth];
          if (level) {
            // get all the locations in the level below that belong here
            level.items = level.original.items.filter(function (item) {
              return selected.isAll || item.isAll || item.parentId === selected.id;
            });
            if (level.selected) {
              // in case we have an all-item, always select the all-item
              if (hasAllItem) {
                level.selected = level.items[0];
              }
              else {
                // cancel the selection if invalid
                var found;
                level.items.forEach(function(item) {
                  if (item.id === level.selected.id) {
                    found = true;
                  }
                });
                if (!found) {
                  delete level.selected;
                }
              }
            }
            // continue recursively
            updateDown(level.items[0], depth + 1);
          } else {
            return;
          }
        }
        level.update = function () {
          updateUp(level.selected, index - 1);
          updateDown(level.selected, index + 1);
        };

        if (options.restrictByLocations) {
          var items = restrictLocations(level.items, options.restrictByLocations, index);
          level.items = items;
        }

        levels[index] = level;
      }

      original.forEach(function(level, index) {
        reset(index);
      });

      location = {
        levels: levels,
        select: function(level, id) {
          levels[level].selectById(id);
          levels[level].update();
        },
        clone: function() {
          var cloned = create(options);
          for (var i=0; i<cloned.levels.length; i++) {
            var selected = levels[i].selected;
            if (selected) {
              cloned.levels[i].selectById(selected.id);
            }
          }
          return cloned;
        },
        compare: function(other) {
          // two locations are equal unless proven to be different
          var equal = levels.length === other.levels.length;
          for (var i=0; i<levels.length; i++) {
            if (!angular.equals(levels[i].selected, levels[i].selected)) {
              equal = false;
            }
            if (!angular.equals(levels[i].items, levels[i].items)) {
              equal = false;
            }
          }
          return equal;
        },
        // pass optional getter function to get the id from the data property
        setAdminDivisions: function(obj, getter) {
          if (obj) {
            // selected locations have the constraint that lower level
            // locations must be child of the higher level ones, while
            // in the object we might have inconsistencies. starting
            // from the bottom, pick the most specific regional info if
            // available and ignore the rest. this code assumes that we
            // have no more than 5 administrative levels
            var toBeSelected = true;
            [5, 4, 3, 2, 1].forEach(function(n) {
              if (toBeSelected) {
                var i = n - 1,
                    val = obj['adminDivision'+n],
                    id = idGetter ? idGetter(val) : val;
                if (id) {
                  try {
                    location.select(i, id);
                    toBeSelected = false;
                  } catch (error) {
                    $log.error(error);
                  }
                }
              }
            });
          } else {
            $log.error('`setAdminDivisions` was called on a `'+obj+'` object');
          }
          return location;
        },
        // pass optional setter function to set the location value in the data
        getAdminDivisions: function(adminDivisions, setter) {
          adminDivisions = adminDivisions || {};
          levels.forEach(function(level, index) {
            if (level.selected) {
              var key = 'adminDivision'+(index+1),
                  val = setter ? setter(level.selected) : level.selected.id;
              adminDivisions[key] = level.selected.id;
            }
          });
          return angular.copy(adminDivisions);
        }
      };
      return location;
    }
    return create;
  });
