module.exports = function (grunt) {
    'use strict';

    var env = grunt.option('env') || 'ui',
        lib = {
            'mobile': 'Zepto',
            'ui': 'jQuery'
        },
        files = require('./libs/files/' + env);

    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),

        'banner': {
            'full': [
                '/*!',
                ' * Chico UI v<%= pkg.version %>',
                ' * http://chico-ui.com.ar/',
                ' *',
                ' * Copyright (c) <%= grunt.template.today("yyyy") %>, MercadoLibre.com',
                ' * Released under the MIT license.',
                ' * http://chico-ui.com.ar/license',
                ' */\n'
            ].join('\n'),
            'min': '/*! Chico UI v<%= pkg.version %> chico-ui.com.ar | chico-ui.com.ar/license */'
        },

        'concat': {
            'options': {
                'stripBanners': {
                    'options': {
                        'block': true,
                        'line': true
                    }
                }
            },

            'core': {
                'options': {
                    'banner': '<%= banner.full %>' + "\n\n(function (window, $) {\n\t'use strict';\n\n",
                    'footer': '\n\twindow.ch = ch;\n}(this, ' + lib[env] + '));'
                },
                'src': files.JS.core,
                'dest': 'temp/' + env + '/core.tmp.js'
            },

            'js': {
                'src': ['temp/' + env + '/core.tmp.js'].concat(files.JS.abilities).concat(files.JS.widgets),
                'dest':'temp/' + env + '/chico.js'
            },

            'css': {
                'options': {
                    'banner': '<%= banner.full %>'
                },
                'src': files.CSS.resetML.concat(files.CSS.core).concat(files.CSS.widgets),
                'dest':'temp/' + env + '/chico.css'
            }
        },

        'uglify': {
            'options': {
                'mangle': false,
                'banner': '<%= banner.min %>' + "(function(window,$){'use strict';",
                'footer': 'window.ch = ch;}(this, ' + lib[env] + '));'
            },

            'min': {
                'src': ['<%= concat.js.dest %>'],
                'dest':'temp/' + env + '/chico.min.js'
            }
        },

        'cssmin': {
            'options': {
                'banner': '<%= banner.min %>',
                'keepSpecialComments': 0
            },

            'ui-css': {
                'src': ['<%= concat.css.dest %>'],
                'dest': 'temp/' + env + '/chico.min.css'
            }
        },

        'clean': ["temp/**/*.tmp.js"],

        'jslint': { // configure the task
            'files': files.JS.abilities.concat(files.JS.widgets),
            'directives': {
                'nomen': true,
                'todo': true
            },
            'options': {
                'errorsOnly': true, // only display errors
                'failOnError': false, // defaults to true
                'shebang': true, // ignore shebang lines
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jslint');

    // Resgister task(s).
    grunt.registerTask('default', []);
    grunt.registerTask('lint', ['jslint']);
    grunt.registerTask('dev', ['concat', 'clean']);
    grunt.registerTask('prod', ['concat', 'uglify', 'cssmin', 'clean']);
};