/*jslint node:true*/
'use strict';

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    jslint: {
      files: [ // some example files
        'grunt.js',
        'lib/**/*.js',
        'tasks/jslint.js',
        'test/*.js'
      ],
      directives: { // some example JSLint directives
        unused: true, // pseudo-directive, will report unused variables
        todo: true,
        indent: 2
      },
      options: {
        junit: 'out/junit.xml',
        jslintXml: 'out/jslint_xml.xml',
        log: 'out/lint.log',
        errorsOnly: false,
        checkstyle: 'out/checkstyle.xml',
        failOnError: true // default
      }
    }
  });

  grunt.loadTasks('./tasks');

  grunt.registerTask('default', 'jslint');

};
