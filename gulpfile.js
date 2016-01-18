var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var path = require('path');
var streamqueue = require('streamqueue');
var eslint = require('gulp-eslint');
var postcss = require('gulp-postcss');
var postcssOpacity = require('postcss-opacity');
var postcssFilterGradient = require('postcss-filter-gradient');
var autoprefixer = require('autoprefixer');

// UI JavaScript
var uiJS = require('./libs/files/ui').JS;

// Mobile JavaScript
var mobileJS = require('./libs/files/mobile').JS;

// Package data
var pkg = require('./package.json');

var distPath = './dist';

var banner = {
    full: [
        '/*!',
        ' * Chico UI v' + pkg.version,
        ' * http://chico-ui.com.ar/',
        ' *',
        ' * Copyright (c) ' + (new Date().getFullYear()) + ', MercadoLibre.com',
        ' * Released under the MIT license.',
        ' * http://chico-ui.com.ar/license',
        ' */\n'
    ].join('\n'),
        'min': '/*! Chico UI v' + pkg.version + ' chico-ui.com.ar | chico-ui.com.ar/license */\n'
};

// Copy Chico related assets
gulp.task('copy', function () {
    // Everything in the assets folder
    return gulp
        .src(['./src/shared/assets/**/*.*'], {
            base: './src/shared/'
        })
        .pipe(gulp.dest(distPath));
});

// Compile Sass
gulp.task('sass', [
    'sass:ui',
    'sass:mobile'
]);

gulp.task('sass:ui', function () {
    return gulp.src('src/ui/styles/ui-theme.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'expanded' // nested, compact, compressed, expanded
        }))
        .pipe(postcss([
            postcssFilterGradient,
            autoprefixer({'browsers': ['last 5 versions', '> 1%']}),
            postcssOpacity
        ]))
        .pipe($.rename('chico.css'))
        .pipe($.wrapper({
            header: banner.full
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(distPath, 'ui')))
        .pipe(browserSync.stream());
});

gulp.task('sass:mobile', function () {
    return gulp.src('src/mobile/styles/mobile-theme.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'expanded' // nested, compact, compressed, expanded
        }))
        .pipe(postcss([
            autoprefixer({'browsers': ['last 5 versions', 'android >= 2.1', '> 1%']})
        ]))
        .pipe($.rename('chico.css'))
        .pipe($.wrapper({
            header: banner.full
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(distPath, 'mobile')))
        .pipe(browserSync.stream());
});

// Minify the compiled CSS
gulp.task('minifyCSS', function() {
    return gulp.src(['dist/**/*.css', '!dist/**/*.min.css'])
        .pipe($.cssnano())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(distPath));
});

// Concatenate and copy Chico JS
gulp.task('concatJS', [
    'concatJS:ui',
    'concatJS:mobile'
]);

gulp.task('concatJS:ui', function() {
    return streamqueue({ objectMode: true },
        gulp.src(uiJS.core).pipe($.concat('core.js')).pipe($.wrapper({
            header: "\n(function (window) {\n\t'use strict';\n\n",
            footer: '\n\tch.version = \'' + pkg.version + '\';\n\twindow.ch = ch;\n}(this));'
        })),
        gulp.src(uiJS.abilities.concat(uiJS.components))
    )
        .pipe($.concat('chico.js'))
        .pipe($.wrapper({
            header: banner.full
        }))
        .pipe(gulp.dest(path.join(distPath, 'ui')));
});

gulp.task('concatJS:mobile', function() {
    return streamqueue({ objectMode: true },
        gulp.src(mobileJS.core).pipe($.concat('core.js')).pipe($.wrapper({
            header: "\n(function (window) {\n\t'use strict';\n\n",
            footer: '\n\tch.version = \'' + pkg.version + '\';\n\twindow.ch = ch;\n}(this));'
        })),
        gulp.src(mobileJS.abilities.concat(mobileJS.components))
    )
        .pipe($.concat('chico.js'))
        .pipe($.wrapper({
            header: banner.full
        }))
        .pipe(gulp.dest(path.join(distPath, 'mobile')));
});

// Minify the JS
gulp.task('minifyJS', [
    'minifyJS:ui',
    'minifyJS:mobile'
]);

// UI JavaScript
gulp.task('minifyJS:ui', function () {
    return gulp.src(path.join(distPath, 'ui/chico.js'))
        .pipe($.uglify({
            beautify: true,
            mangle: false
        }).on('error', function(e) {
            console.log(e);
        }))
        .pipe($.wrapper({
            header: banner.min
        }))
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(path.join(distPath, 'ui')));
});

// Mobile JavaScript
gulp.task('minifyJS:mobile', function () {
    return gulp.src(path.join(distPath, 'mobile/chico.js'))
        .pipe($.uglify({
            beautify: true,
            mangle: false
        }).on('error', function(e) {
            console.log(e);
        }))
        .pipe($.wrapper({
            header: banner.min
        }))
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(path.join(distPath, 'mobile')));
});

// Start a BrowserSync server, which you can view at http://localhost:3040
gulp.task('browser-sync', ['build'], function () {
    browserSync.init({
        port: 3040,
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
        },
        bsFiles: {
            src: [
                'dist/**/*.css',
                'dist/**/*.js',
                'views/*.html'
            ]
        }
    });

    gulp.watch(['src/shared/**/*.js', 'src/ui/**/*.js'], ['concatJS:ui']);
    gulp.watch(['src/shared/**/*.js', 'src/mobile/**/*.js'], ['concatJS:mobile']);
    gulp.watch('dist/**/*.js').on('change', reload);
    gulp.watch('src/views/*.html').on('change', reload);
    gulp.watch('src/**/styles/**/*.scss', ['sass']);
});

// Validates JavaScript files with ESLint
gulp.task('lint', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

// Build all files without starting a server
gulp.task('build', function (done) {
    runSequence([
        'copy',
        'sass',
        'concatJS'
    ], done);
});

// Build and minify all files without starting a server
gulp.task('dist', function (done) {
    runSequence('build', [
        'minifyCSS',
        'minifyJS'
    ], done);
});

// Dev task: build the Chico and start a server
gulp.task('dev', [
    'build',
    'browser-sync'
]);

// Default task: run the dev
gulp.task('default', ['dev']);
