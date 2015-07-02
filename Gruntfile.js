module.exports = function (grunt) {
    'use strict';

    var path = require('path');
    var pkg = require('./bower_components/chico/bower.json');
    var JS = {};

    /*
     * JS: Core
     */
    JS.core = [
        "src/shared/scripts/helpers.js",
        "src/shared/scripts/util.js",
        "src/shared/scripts/support.js",
        "src/shared/scripts/events.js",
        "src/ui/scripts/events.js",
        "src/shared/scripts/factory.js",
        "src/ui/scripts/init.js"
    ];

    /*
     * JS: Abilities
     */
    JS.abilities = [
        "src/shared/scripts/EventEmitter.js",
        "src/shared/scripts/Content.js",
        "src/shared/scripts/Collapsible.js",
        "src/shared/scripts/Viewport.js",
        "src/shared/scripts/Positioner.js",
        "src/ui/scripts/shortcuts.js"
    ];

    /*
     * JS: Components
     */
    JS.components = [
        "src/shared/scripts/onImagesLoads.js",
        "src/shared/scripts/Component.js",
        "src/shared/scripts/Form.js",
        "src/shared/scripts/Condition.js",
        "src/shared/scripts/Validation.js",
        "src/ui/scripts/Validation.js",
        "src/shared/scripts/String.js",
        "src/shared/scripts/MaxLength.js",
        "src/shared/scripts/MinLength.js",
        "src/shared/scripts/Email.js",
        "src/shared/scripts/URL.js",
        "src/shared/scripts/Number.js",
        "src/shared/scripts/Min.js",
        "src/shared/scripts/Max.js",
        "src/shared/scripts/Custom.js",
        "src/shared/scripts/Required.js",
        "src/shared/scripts/Expandable.js",
        "src/shared/scripts/Menu.js",
        "src/shared/scripts/Popover.js",
        "src/ui/scripts/Popover.js",
        "src/shared/scripts/Layer.js",
        "src/shared/scripts/Tooltip.js",
        "src/shared/scripts/Bubble.js",
        "src/shared/scripts/Modal.js",
        "src/shared/scripts/Transition.js",
        "src/ui/scripts/Zoom.js",
        "src/shared/scripts/Calendar.js",
        "src/shared/scripts/Dropdown.js",
        "src/ui/scripts/Dropdown.js",
        "src/ui/scripts/Tabs.js",
        "src/shared/scripts/Carousel.js",
        "src/shared/scripts/Countdown.js",
        "src/ui/scripts/Datepicker.js",
        "src/shared/scripts/Autocomplete.js",
        "src/ui/scripts/Autocomplete.js"
    ];

    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),

        copy: {
            main: {
                src: 'package.json',
                dest: '_data/',
            },
        },

        // Builds an API documentation
        jsdoc: {
            ui: {
                'src': JS.core.concat(JS.abilities).concat(JS.components).map(function(f) {return path.join('bower_components/chico', f)}),
                'options': {
                    'template': './libs/doc-template',
                    'destination': './api-doc/ui',
                    'private': false
                }
            },
            mobile: {
                'src': JS.core.concat(JS.abilities).concat(JS.components).map(function(f) {return path.join('bower_components/chico', f)}),
                'options': {
                    'template': './libs/doc-template',
                    'destination': './api-doc/mobile',
                    'private': false
                }
            }
        }

    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Resgister task(s).
    grunt.registerTask('getVersion', ['copy']);
};