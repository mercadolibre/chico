module.exports = function (grunt) {
    'use strict';

    var uiFiles = require('./libs/files/ui'),
        mobileFiles = require('./libs/files/mobile');

    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),

        'banner': {
            'full': [
                '/*!',
                ' * Chico Theme UI v<%= pkg.version %>',
                ' * http://chico-ui.com.ar/',
                ' *',
                ' * Copyright (c) <%= grunt.template.today("yyyy") %>, MercadoLibre.com',
                ' * Released under the MIT license.',
                ' * http://chico-ui.com.ar/license',
                ' */\n'
            ].join('\n'),
            'min': '/*! Chico UI v<%= pkg.version %> chico-ui.com.ar | chico-ui.com.ar/license */'
        },

        // Concatenate files.
        concat: {
            options: {
                stripBanners: {
                    options: {
                        block: true,
                        line: true
                    }
                }
            },
            coreUi: {
                options: {
                    banner: "\n(function (window, $) {\n\t'use strict';\n\n",
                    footer: '\n\tch.version = \'<%= pkg.version %>\';\n\twindow.ch = ch;\n}(this, this.$));'
                },
                src: uiFiles.JS.core,
                dest: 'temp/ui/core.tmp.js'
            },
            coreMobile: {
                options: {
                    banner: "\n(function (window, $) {\n\t'use strict';\n\n",
                    footer: '\n\tch.version = \'<%= pkg.version %>\';\n\twindow.ch = ch;\n}(this, this.$));'
                },
                src: mobileFiles.JS.core,
                dest: 'temp/mobile/core.tmp.js'
            },
            jsUi: {
                src: ['<%= concat.coreUi.dest %>'].concat(uiFiles.JS.abilities).concat(uiFiles.JS.components),
                dest: 'dist/ui/<%= pkg.name %>.js'
            },
            jsMobile: {
                src: ['<%= concat.coreMobile.dest %>'].concat(mobileFiles.JS.abilities).concat(mobileFiles.JS.components),
                dest: 'dist/mobile/<%= pkg.name %>.js'
            }
        },

        // Watches for the changes in a project
        watch: {
            options: {
                debounceDelay: 500
            },
            gruntfile: {
                options: {
                    reload: true
                },
                files: [ 'Gruntfile.js' ]
            },
            sassUi: {
                files: [
                    './src/shared/**/*.scss',
                    './src/ui/**/*.scss'
                ],
                tasks: ['sass:ui']
            },
            sassMobile: {
                files: [
                    './src/shared/**/*.scss',
                    './src/mobile/**/*.scss'
                ],
                tasks: ['sass:mobile']
            },
            jsUi: {
                files: [
                    './src/shared/**/*.js',
                    './src/ui/**/*.js'
                ],
                tasks: ['concat:coreUi', 'concat:jsUi']
            },
            jsMobile: {
                files: [
                    './src/shared/**/*.js',
                    './src/mobile/**/*.js'
                ],
                tasks: ['concat:coreMobile', 'concat:jsMobile']
            }
        },

        // Compile sass files to css
        sass: {
            options: {
                style: 'expanded', // nested, compact, compressed, expanded
                lineNumbers: false,
                sourcemap: 'auto', // auto, file, inline, none
                loadPath: [
                    'bower_components/bourbon/app/assets/stylesheets/',
                    './'
                ]
            },
            ui: {
                files: {
                    'dist/ui/<%= pkg.name %>.css': 'src/ui/styles/ui-theme.scss'
                }
            },
            mobile: {
                files: {
                    'dist/mobile/<%= pkg.name %>.css': 'src/mobile/styles/mobile-theme.scss'
                }
            }
        },

        // Minify project's CSS
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: 0,
                advanced: true // TODO: Validate the output
            },
            distUi: {
                src: 'dist/ui/<%= pkg.name %>.css',
                dest: 'dist/ui/<%= pkg.name %>.min.css'
            },
            distMobile: {
                options: {
                    compatibility: '*'
                },
                src: 'dist/mobile/<%= pkg.name %>.css',
                dest: 'dist/mobile/<%= pkg.name %>.min.css'
            }
        },

        // Put banners in dist files
        usebanner: {
            full: {
                options: {
                    position: 'top',
                    banner: '<%= banner.full %>'
                },
                files: {
                    src: ['dist/**/*.css', 'dist/**/*.js', '!dist/**/*.min.css', '!dist/**/*.min.js']
                }
            },
            min: {
                options: {
                    position: 'top',
                    banner: '<%= banner.min %>'
                },
                files: {
                    src: ['dist/**/*.min.css', 'dist/**/*.min.js']
                }
            }
        },

        // Auto-refresh page
        browserSync: {
            dev: {
                options: {
                    port: 3040,
                    watchTask: true,
                    startPath: '/ui.html',
                    server: {
                        baseDir: [
                            // base path for views and demo assets
                            'views/',
                            // root folder for everything else
                            './'
                        ],
                        middleware: [
                            function(req, res, next) {
                                var redirectTo;

                                switch (req.url) {
                                    case '/':
                                    case '/ui':
                                        redirectTo = '/ui.html';
                                        break;
                                    case '/m':
                                    case '/mobile':
                                        redirectTo = '/mobile.html';
                                        break;
                                }

                                if (redirectTo) {
                                    res.writeHead(301, {Location: redirectTo});
                                    res.end();
                                } else {
                                    next();
                                }
                            }
                        ]
                    }
                },
                bsFiles: {
                    src: [
                        'dist/**/*.css',
                        'dist/**/*.js',
                        'views/*.html'
                    ]
                }
            },
            test: {
                options: {
                    port: 3040,
                    watchTask: true,
                    startPath: '/tests',
                    directory: true,
                    server: {
                        baseDir: ['./', './views/'],
                        routes: {
                            '/test': 'tests',
                            '/static': 'views/static'
                        }
                    }
                },
                bsFiles: {
                    src: [
                        'dist/**/*.css',
                        'dist/**/*.js',
                        'tests/**/spect.js',
                        'tests/**/index.html'
                    ]
                }
            }
        },

        // Minify JS
        uglify: {
            options: {
                preserveComments: false,
                mangle: true
            },

            jsUiDist: {
                src: ['<%= concat.jsUi.dest %>'],
                dest: 'dist/ui/<%= pkg.name %>.min.js'
            },
            jsMobileDist: {
                src: ['<%= concat.jsMobile.dest %>'],
                dest: 'dist/mobile/<%= pkg.name %>.min.js'
            }
        },

        // Copies an assets
        copy: {
            assets: {
                cwd: 'src/shared/assets/',
                expand: true,
                src: '*',
                dest: 'dist/assets/'
            }
        },

        // Cleans files and folders.
        'clean': ['temp'],

        // Validates JavaScript files with JSLint as a grunt task.
        'jslint': {
            'files': uiFiles.JS.abilities.concat(uiFiles.JS.components).concat(mobileFiles.JS.abilities).concat(mobileFiles.JS.components),
            'directives': {
                'browser': true,
                'nomen': true,
                'todo': true
            },
            'options': {
                'errorsOnly': true, // only display errors
                'failOnError': false, // defaults to true
                'shebang': true // ignore shebang lines
            }
        },

        // Builds an API documentation
        jsdoc: {
            ui: {
                'src': uiFiles.JS.core.concat(uiFiles.JS.abilities).concat(uiFiles.JS.components),
                'options': {
                    'template': './libs/doc-template',
                    'destination': './doc/ui',
                    'private': false
                }
            },
            mobile: {
                'src': mobileFiles.JS.core.concat(mobileFiles.JS.abilities).concat(mobileFiles.JS.components),
                'options': {
                    'template': './libs/doc-template',
                    'destination': './doc/mobile',
                    'private': false
                }
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Resgister task(s).
    grunt.registerTask('default', []);
    grunt.registerTask('lint', ['jslint']);
    grunt.registerTask('doc', ['jsdoc:ui', 'jsdoc:mobile']);
    grunt.registerTask('build', ['copy:assets', 'sass', 'concat', 'clean']);
    grunt.registerTask('sync', ['browserSync:dev', 'watch']);
    grunt.registerTask('dev', ['build', 'sync']);
    grunt.registerTask('test', ['build', 'browserSync:test', 'watch']);
    grunt.registerTask('dist', ['copy:assets', 'sass', 'cssmin', 'concat', 'uglify:jsUiDist', 'uglify:jsMobileDist', 'usebanner', 'clean']);
};
