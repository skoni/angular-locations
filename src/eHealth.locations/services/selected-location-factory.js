'use strict';

angular.module('eHealth.locations.services')
  .factory('selectedLocationFactory', function (locations, $log) {

    // Restrict locations. This originally leveraged lodash/underscore _.filter
    // & _.find functions, as lodash/underscore is not available in this
    // project, and while we can't rely on native implementations accross
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
          allItemName = options.allItemName || 'all',
          locationsData = options.locationsData || locations,
          incremental = options.incremental || false,
          levels = [],
          location;

      function reset(index) {
        var original = locationsData[index],
            // avoid using the original object reference, which we do
            // not want to modify
            level = {
              name: original.name,
              items: original.items,
              original: original
            };
        removeFilters(true);
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
        function removeFilters(selected) {
          level.items = original.items;
          if (hasAllItem) {
            // adds an all-item.
            // The all-item will be automatically selected when there is not
            // a more narrow selection for this level or a child level
            var allItem = {
              isAll: true,
              name: allItemName
            };

            // do not edit `level.items` in place! it might refer to
            // external location data which we don't want to mess up
            level.items = [allItem].concat(original.items);
            if (selected) {
              level.selected = allItem;
            }
          }
        }
        function updateUp(selected, depth) {
          if (selected) {
            if (depth < 0 || selected.isAll) {
              return;
            }
            reset(depth);
            levels[depth].selectById(selected.parentId);
            levels[depth].filterBySelectedParent();
            updateUp(levels[depth].selected, depth - 1);
          }
        }
        function updateDown(selected, depth) {
          function hide() {
            // remove this level and all childs, `splice` gets an
            // 1-based index of the last element to be kept
            levels.splice(depth, Number.MAX_VALUE);
          }
          var level = levels[depth];
          if (selected) {
            if (level) {
              level.filterByParent(selected.id);

              if (level.items.length) {
                if (level.selected) {
                  // in case we have an all-item, always select the all-item
                  if (hasAllItem) {
                    level.selected = level.items[0];
                  } else {
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
                updateDown(level.selected, depth + 1);
              } else {
                // this level has no items
                if (incremental) {
                  hide();
                }
              }
            } else {
              // level not existing. we could be at the end of the
              // hierarchy, or we could run in incremental mode. in
              // the second case levels are created just when their
              // parent is selected
              if (incremental && locationsData[depth]) {
                reset(depth); // this will create the level
                updateDown(selected, depth); // now try again
              } else {
                // end of the hierarchy
                return;
              }
            }
          } else {
            if (level) {
              // parent not selected. if we are running in incremental
              // mode, we need to remove child levels
              // otherwise we need to remove child selected value
              if (incremental) {
                hide();
              } else {
                delete level.selected;
                updateDown(false, depth + 1);
              }
            } else {
              // either end of the hierarchy or end of the levels we
              // want to show, if in incremental mode, since the
              // parent is not selected
              return;
            }
          }
        }
        level.update = function () {
          updateUp(level.selected, index - 1);
          updateDown(level.selected, index + 1);
        };
        level.deselect = function() {
          for (var i = index; i < levels.length; i++) {
            reset(i);
          }
        };
        level.filterByParent = function(id) {
          removeFilters(false);
          if (id) {
            level.items = level.items.filter(function (item) {
              return item.isAll || item.parentId === id;
            });
          }
        };
        level.filterBySelectedParent = function() {
          level.filterByParent(level.selected.parentId);
        };

        if (options.restrictByLocations) {
          var items = restrictLocations(level.items, options.restrictByLocations, index);
          level.items = items;
        }

        levels[index] = level;
      }

      if (incremental) {
        reset(0);
      } else {
        locationsData.forEach(function(level, index) {
          reset(index);
        });
      }

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
        setAdminDivisions: function(obj) {
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
                    id = obj['adminDivision'+n];
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
        getAdminDivisions: function(adminDivisions) {
          adminDivisions = adminDivisions || {};
          levels.forEach(function(level, index) {
            if (level.selected) {
              var key = 'adminDivision'+(index+1);
              adminDivisions[key] = level.selected.id;
            }
          });
          return angular.copy(adminDivisions);
        },
        getInnermost: function () {
          var selected = levels.filter(function (l) { return l.selected; });
          var level = selected.slice(-1)[0];
          return level ? level.selected : null;
        },
        clear: function () {
          var root = levels[0];
          if (root) {
            root.deselect();
          }
        }
      };
      return location;
    }
    return create;
  });
