[![Build Status](https://travis-ci.org/eHealthAfrica/angular-locations.svg?branch=master)](https://travis-ci.org/eHealthAfrica/angular-locations)

# eHealth.locations

To run the tests and build, run:

    $ grunt

To add a new country:

* update `bower.json` to the new version of eHealthAfrica/locations containing the country.
* add the country to the `ngconstant` task of the `Gruntfile`.
* add the country to `src/services/locationsFactory.js`.
* build
* release the new version.

On new releases, update the version in `bower.json`, `package.json`
and [the changelog](/blob/master/CHANGELOG.md) and add a new tag.
