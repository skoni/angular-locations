# Change Log

All notable changes to this project will be documented in this
file. This file is structured according to http://keepachangelog.com/

- - -
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
