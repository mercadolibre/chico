module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),

        copy: {
            main: {
                src: 'package.json',
                dest: '_data/',
            },
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Resgister task(s).
    grunt.registerTask('getVersion', ['copy']);
};