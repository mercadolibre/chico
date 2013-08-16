module.exports = function (grunt) {
    'use strict';

    var environment = grunt.option('env') || 'ui',
        destination = grunt.option('dest') || 'temp',
        lib = {
            'mobile': 'Zepto',
            'ui': 'jQuery'
        },
        files = require('./libs/files/' + environment);

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
                    'footer': '\n\twindow.ch = ch;\n}(this, ' + lib[environment] + '));'
                },
                'src': files.JS.core,
                'dest': 'temp/' + environment + '/core.tmp.js'
            },

            'js': {
                'src': ['temp/' + environment + '/core.tmp.js'].concat(files.JS.abilities).concat(files.JS.widgets),
                'dest': destination + '/' + environment + '/chico.js'
            },

            'css': {
                'options': {
                    'banner': '<%= banner.full %>'
                },
                'src': files.CSS.resetML.concat(files.CSS.core).concat(files.CSS.widgets),
                'dest': destination + '/' + environment + '/chico.css'
            }
        },

        'uglify': {
            'options': {
                'mangle': false,
                'banner': '<%= banner.min %>'
            },

            'min': {
                'src': ['<%= concat.js.dest %>'],
                'dest': destination + '/' + environment + '/chico.min.js'
            }
        },

        'cssmin': {
            'options': {
                'banner': '<%= banner.min %>',
                'keepSpecialComments': 0
            },

            'ui-css': {
                'src': ['<%= concat.css.dest %>'],
                'dest': destination + '/' + environment + '/chico.min.css'
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
        },

        'jsdoc': {
            'dist': {
                'src': [
                    "src/shared/js/ch.helpers.js",
                    "src/shared/js/ch.util.js",
                    "src/shared/js/ch.support.js",
                    "src/shared/js/ch.events.js",
                    "src/ui/js/ch.events.js",
                    "src/shared/js/ch.factory.js",
                    "src/ui/js/ch.init.js",

                    "src/shared/js/ch.EventEmitter.js",
                    "src/shared/js/ch.Content.js",
                    "src/shared/js/ch.Closable.js",
                    "src/shared/js/ch.Collapsible.js",
                    "src/shared/js/ch.Viewport.js",
                    "src/shared/js/ch.Positioner.js",
                    "src/ui/js/ch.shortcuts.js",

                    "src/shared/js/ch.Widget.js",
                    "src/shared/js/ch.Expandable.js",
                    "src/shared/js/ch.Form.js",
                    "src/shared/js/ch.Menu.js",

                    "src/ui/js/ch.Tabs.js"


                ],
                'options': {
                    'destination': './doc',
                    'private': false
                }
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Resgister task(s).
    grunt.registerTask('default', []);
    grunt.registerTask('lint', ['jslint']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('dev', ['concat', 'clean']);
    grunt.registerTask('prod', ['concat', 'uglify', 'cssmin', 'clean']);
};