'use strict';
module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ''
      },
      library: {
        src: [
          'src/eHealth.locations/eHealth.locations.prefix',
          'src/eHealth.locations/eHealth.locations.js',
          'src/eHealth.locations/eHealth.locations.data.js',
          'src/eHealth.locations/directives/**/*.js',
          'src/eHealth.locations/filters/**/*.js',
          'src/eHealth.locations/services/**/*.js',
          'src/eHealth.locations/eHealth.locations.suffix'
        ],
        dest: 'dist/ehealthlocations.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      jid: {
        files: {
          'dist/ehealthlocations.min.js': ['<%= concat.library.dest %>']
        }
      }
    },
    jshint: {
      beforeConcat: {
        options: {
          // allow to have global 'use stricts' statements. strict
          // statements will be removed anyway from the
          // `remove_usestrict` task below
          globalstrict: true
        },
        src: ['gruntfile.js', 'src/eHealth.locations/**/*.js']
      },
      afterConcat: {
        src: [
          '<%= concat.library.dest %>'
        ]
      },
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
          angular: true
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      files: [
        'Gruntfile.js',
        'src/**/*'
      ],
      tasks: ['default']
    },
    ngconstant: {
      options: {
        name: 'eHealth.locations.data',
        dest: 'src/eHealth.locations/eHealth.locations.data.js',
        constants: {
          ml: grunt.file
            .readJSON('bower/locations/json/mali.json'),
          sl: grunt.file
            .readJSON('bower/locations/json/sierra_leone.json'),
          lr: grunt.file
            .readJSON('bower/locations/json/liberia.json'),
          gn: grunt.file
            .readJSON('bower/locations/json/guinea.json')
        }
      },
      build: {}
    },
    karma: {
      unit: {
        configFile: 'karma-unit.conf.js',
        singleRun: true
      }
    },
    ngAnnotate: {
      app: {
        files: {
          'dist/ehealthlocations.js': ['src/eHealth.locations/{*,**/*}.js']
        }
      }
    },
    remove_usestrict: {
      dist: {
        files: [{
          expand: true,
          src: 'dist/ehealthlocations.js'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-remove-usestrict');

  grunt.registerTask('default', [
    'jshint:beforeConcat',
    'ngAnnotate',
    'remove_usestrict',
    'jshint:afterConcat',
    'uglify'
  ]);
  grunt.registerTask('livereload', ['default', 'watch']);
  grunt.registerTask('test', [
    'ngconstant',
    'concat',
    'karma'
  ]);
};
