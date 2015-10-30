module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai-spies', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            {pattern: 'test/mock/*.html', watched: false, included: false},
            {pattern: 'test/mock/*.png', watched: false, included: false},
            'node_modules/tiny.js/dist/tiny.js',
            'dist/ui/chico.js',
            'test/**/*.spec.js'
        ],

        // list of files to exclude
        exclude: [
        ],

        //
        proxies: {
            '/mock/': '/base/test/mock/'
        },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {

        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha'],

        // mocha reporter options
        // possible values: 'full' , 'autowatch', 'minimal', 'noFailures'
        mochaReporter: {
            output: 'autowatch'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // How long will Karma wait for a message from a browser before disconnecting from it (in ms).
        browserNoActivityTimeout: 60000,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
