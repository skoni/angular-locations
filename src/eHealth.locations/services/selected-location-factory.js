'use strict';

angular.module('eHealth.locations.services')
  .factory('selectedLocationFactory', function (locations) {
    function create(options) {
      var options = options || {},
          hasAllItem = options.hasAllItem,
          locationsData = options.locationsData || locations,
          original = angular.copy(locationsData),
          levels = [];

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
        };
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
        };
        level.update = function () {
          updateUp(level.selected, index - 1);
          updateDown(level.selected, index + 1);
        };
        levels[index] = level;
      }

      original.forEach(function(level, index) {
        reset(index);
      });

      return {
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
        }
      };
    }
    return create;
  });
