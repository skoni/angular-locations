# Change Log

All notable changes to this project will be documented in this
file. This file is structured according to http://keepachangelog.com/

- - -

## 1.13.0 - 2015-05-07
### Added
- method for clearing multi-level selection
- property to get innermost selection
- directive for rendering innermost selected division

## 1.12.0 - 2015-03-30
### Added
- In incremental mode, do not show empty levels

## 1.11.0 - 2015-03-30
### Added
- Incremental mode for selected locations
### Changed
- When a level of a selected location is selected, its childs will not
  have the first item selected by default

## 1.10.1 - 2015-03-06
### Changed
- When a location code cannot be found, log at debug level, not error anymore

## 1.10.0 - 2015-02-24
### Changed
- Adopted new locations data, with a different name for districts in Liberia
### Fixed
- Fixed a bug which would show all items on an ancestor level when
  items were selected on a descendant

## 1.9.0 - 2015-02-23
### Added
- Performance improvements when creating a selected location over
  levels with an high number of items (thousands)

## [1.8.0] - 2015-02-20
### Changed
- New locations version

### Fixed
- Avoid throwing exceptions when `update` is called on an unselected level

## [1.7.0] - 2015-02-11
### Added
- Add the `deselect` method in levels

## [1.6.1] - 2015-02-10
### Fixed
- Bump location dependency for fixed guinea data

## [1.6.0] - 2015-02-04
### Added
- Feature: ability to restrict locations

## [1.5.2] - 2014-12-22
### Fixed
- Fixed Gruntfile to build locations.

## [1.5.1] - 2014-12-22
### Fixed
- Add Madagascar to the Gruntfile and the locations factory.
- Fix: Sierra Leona was using Liberia locations.

## [1.5.0] - 2014-12-22
### Added
- Add support for Madagascar locations.

## [1.4.1] - 2014-12-17
### Fixed
- Avoid logging an error when decoding and filtering an undefined code

## [1.4.0] - 2014-12-17
### Added
- The library has now annotations so it can be safely minified. A
  minified version is distributed as well

## [1.3.0] - 2014-12-16
### Added
- `setAdminDivisions` can be called on an undefined object without
  rising an exception
### Fixed
- text in an error message

## [1.2.0] - 2014-12-15
### Added
- selected location `getAdminDivisions` and `setAdminDivisions` methods

## [1.1.0] - 2014-12-15
### Added
- `locations.decode` method
- `adminDivision` filter
