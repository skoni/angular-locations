// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('eHealth.locations.config', [])
    .value('eHealth.locations.config', {
        debug: true
    });

// Modules
angular.module('eHealth.locations.directives', []);
angular.module('eHealth.locations.filters', []);
angular.module('eHealth.locations.services', [
        'eHealth.locations.data',
]);
angular.module('eHealth.locations',
    [
        'eHealth.locations.config',
        'eHealth.locations.directives',
        'eHealth.locations.filters',
        'eHealth.locations.services'
    ]);
