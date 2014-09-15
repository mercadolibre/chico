/*
 * grunt-git-deploy
 * https://github.com/iclanzan/grunt-git-deploy
 *
 * Copyright (c) 2013 Sorin Iclanzan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('init_repo', 'Initialize a git repository in a directory.', function() {
    var dest = this.files[0].dest;

    if (!grunt.file.exists(dest)) {
      grunt.file.mkdir(dest);
    }

    else if (!grunt.file.isDir(dest)) {
      grunt.fail.warn('A source directory is needed.');
      return false;
    }

    var done = this.async();

    grunt.util.spawn({
      cmd: 'git',
      args: ['init'],
      opts: {cwd: dest}
    }, done);
  });

  // Project configuration.
  grunt.initConfig({

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    init_repo: {
      main: {
        dest: 'tmp/repo'
      }
    },

    copy: {
      first: {
        expand: true,
        cwd: 'test/fixtures/first',
        src: '**/**',
        dest: 'tmp/src/'
      },
      second: {
        expand: true,
        cwd: 'test/fixtures/second',
        src: '**/**',
        dest: 'tmp/src/'
      },
    },

    // Configuration to be run (and then tested).
    git_deploy: {
      default_options: {
        options: {
          url: '../repo'
        },
        src: 'tmp/src'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'init_repo', 'copy:first', 'git_deploy', 'copy:second', 'git_deploy', 'nodeunit']);

  // By default, run all tests.
  grunt.registerTask('default', ['test']);

};
