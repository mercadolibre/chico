module.exports = function (grunt) {
    'use strict';

    // Show elapsed time after tasks run
    require('time-grunt')(grunt);
    // Load all Grunt tasks
    require('jit-grunt')(grunt);

    var path = require('path');
    var semver = require('semver');
    var pkg = require('./bower_components/chico/bower.json');
    var version = grunt.option('process-as') || pkg.version;
    var chicoPath = 'bower_components/chico/';
    var chicoSrcPath = path.join(chicoPath, 'src');
    var chicoDistPath = path.join(chicoPath, 'dist');

    if (semver.valid(version) === null) {
        throw new Error('Provided version is invalid');
    }


    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),

        app: {
            src: 'site',
            dest: '_site'
        },

        copy: {
            cname: {
                src: './CNAME',
                dest: '<%= app.dest %>/',
                expand: true,
                cwd: '.'
            },
            chicoAssets: {
                src: '*',
                dest: '<%= app.dest %>/assets/assets',
                expand: true,
                cwd: chicoDistPath + '/assets'
            }
        },

        symlink: {
            options: {
                overwrite: true
            },
            current: {
                src: '<%= app.src %>/api-doc/' + version,
                dest: '<%= app.src %>/api-doc/current'
            }
        },

        jekyll: {
            dist: {
                options: {
                    dest: '<%= app.dest %>',
                    config: '_config.yml,_config.dist.yml'
                }
            },
            dev: {
                options: {
                    dest: '<%= app.dest %>',
                    drafts: true,
                    config: '_config.yml'
                }
            }
        },

        watch: {
            options: {
                debounceDelay: 500
            },
            gruntfile: {
                options: {
                    reload: true
                },
                files: ['Gruntfile.js']
            },
            jekyll: {
                files: [
                    'site/**/*.{html,yml,md,markdown}',
                    'assets/**/*.{css,js,png}',
                    '!<%= app.dest %>'
                ],
                tasks: ['jekyll:dev']
            }
        },

        browserSync: {
            dev: {
                options: {
                    port: 4000,
                    watchTask: true,
                    startPath: '/',
                    directory: false,
                    server: {
                        baseDir: ['./<%= app.dest %>']
                    }
                },
                bsFiles: {
                    src: [
                        '<%= app.dest %>/**/*.{css,js,html,png,svg}'
                    ]
                }
            }
        },

        // Builds an API documentation
        jsdoc: {
            ui: {
                'src': getJSSources('ui'),
                'options': {
                    'template': './libs/doc-template',
                    'destination': path.join('./site/api-doc', version, 'ui'),
                    'private': false
                }
            },
            mobile: {
                'src': getJSSources('mobile'),
                'options': {
                    'template': './libs/doc-template',
                    'destination': path.join('./site/api-doc', version, 'mobile'),
                    'private': false
                }
            }
        },

        'gh-pages': {
            options: {
                base: '_site'
            },
            src: ['**']
        }
    });

    // Register task(s).
    grunt.registerTask('updatedata', function() {
        var dataFile = "site/_data/package.json";
        var data = {};

        if (grunt.file.exists(dataFile)) {
            data = grunt.file.readJSON(dataFile);
        }

        data.version = version;
        //data.versionName = isCurrentVersion(version) ? 'current' : version;
        data.repository = {
            url: 'https://github.com/mercadolibre/chico.git'
        };

        grunt.file.write(dataFile, JSON.stringify(data, null, 2));
    });

    grunt.registerTask('checkCurrent', function() {
        if (isCurrentVersion()) {
            grunt.task.run('symlink:current');
        }
    });

    grunt.registerTask('apidoc', ['updatedata', 'jsdoc', 'checkCurrent']);

    grunt.registerTask('dev', ['copy', 'jekyll:dev', 'browserSync:dev', 'watch']);

    grunt.registerTask('dist', ['copy', 'apidoc', 'jekyll:dist']);

    grunt.registerTask('deploy', ['dist', 'gh-pages']);

    /*
     * Private Helpers
     */

    // Obtains list of JS sources
    // TODO: Replace with another one that will return the real list and not just everything
    function getJSSources(sourcesSet) {
        //JS.core.concat(JS.abilities).concat(JS.components)

        if (!/(ui|mobile)/.test(sourcesSet)) {
            throw new Error('Wrong sources name');
        }
        var jsFiles = [];
        var folderRegex = new RegExp('(' + sourcesSet + ('|shared') + ')' + (path.sep == '\\' ? '\\\\' : '\/') + 'scripts$');

        grunt.file.recurse(chicoSrcPath, function callback(abspath, rootdir, subdir, filename) {
            if (folderRegex.test(subdir) &&  /.+\.js$/.test(filename)) {
                jsFiles.push(abspath);
            }
        });
        //console.log(jsFiles);

        return jsFiles;
    }

    // Looks for existing folders in ./site/api-doc and compares to the version passed to grunt
    function isCurrentVersion() {
        var versions = grunt.file.expand({
                filter: 'isDirectory',
                cwd: './site/api-doc/'
            }, '*')
            .filter(function(v) {
                return semver.valid(v) !== null;
            })
            .sort(function(a, b) {
                return semver.lt(a, b);
            });

        if (versions.length === 0) {
            throw new Error('Looks like api-doc directory is empty');
        }

        return  semver.eq(versions[0], version);
    }
};
