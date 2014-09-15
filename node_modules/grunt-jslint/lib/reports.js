/*jslint node:true, stupid: true*/

'use strict';

require('./colors.js');

var fs = require('fs');

/**
 * Grab the `underscore/lodash` util from grunt.  The `util` namespace changed
 * form 0.3 to 0.4, so we're checking for both.
 */
var underscore = (function () {
  /*jslint nomen:true*/

  var grunt = require('grunt');

  // grunt 0.4
  if (grunt.util && grunt.util._) {
    return grunt.util._;
  }

  // grunt 0.3
  return grunt.utils._;

}());

var templates = require('./templates/index');

/**
 * Escapes the given value so that it can be placed in an XML file.
 *
 * @param  {String} value
 * @return {String} The escaped value
 */
function escapeForXml(value) {
  return value.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
}

/**
 * Create a checkstyle XML report
 *
 * @param  {Object} report
 * @return {String}
 */
function checkstyle(report) {
  /*jslint nomen:true*/

  var filenames = Object.keys(report.files),
    checkstyleIssues = [];

  filenames.forEach(function (file) {

    var issue = {
        'name': file,
        'issues': []
      },
      pending = report.files[file].length;

    file = report.files[file];

    if (!pending) {
      // if there are no issues, we still want the file path in the XML
      return checkstyleIssues.push(issue);
    }

    file.forEach(function (failure) {

      issue.issues.push({
        'line': failure.line,
        'column': failure.character || '',
        'severity': 'warning',
        'message': escapeForXml(failure.reason || 'Unused variable "' + failure.name + '"'),
        'source': 'com.jslint.foo'
      });

      pending -= 1;
      if (!pending) {
        checkstyleIssues.push(issue);
      }

    });

  });

  return underscore.template(templates.checkstyle, {
    'report': checkstyleIssues
  });
}

/**
 * Produce the standard grunt-jslint report
 *
 * @param  {Object} report
 * @return {String}
 */
function standard(report) {
  return underscore.template(templates.standard, {
    'report': report
  });

}

/**
 * Create a JUnit-style XML report
 *
 * @param  {Object} report
 * @return {String}
 */
function junitXml(report) {
  var testCases = [],
    files = Object.keys(report.files);

  files.forEach(function (file) {

    var name = file,
      failures = [],
      filepathParts = underscore.compact(name.split(/[\\\/]/)),
      classname = filepathParts.join('.')
        .replace(/\.js$/i, '')
        .replace(/-/g, '_'),
      filename = underscore.last(filepathParts);

    report.files[file].forEach(function (failure) {
      failures.push({
        id: filename + ':' + failure.line + ':' + (failure.character || ''),
        message: escapeForXml([
          failure.line + ':',
          failure.character ? failure.character + ':' : '',
          ' ',
          failure.reason || 'Unused variable `' + failure.name + '`'
        ].join(''))
      });
    });

    testCases.push({
      'name': file,
      'classname': classname,
      'filename': filename,
      'failures': failures
    });

  });

  return underscore.template(templates['junit-xml'], {
    'report': testCases
  });
}

/**
 * Create a JSLint-style XML report
 *
 * @param  {Object} report
 * @return {String}
 */
function jslintXml(report) {
  var keys = Object.keys(report.files),
    files = [];

  keys.forEach(function (file) {
    var issues = report.files[file];
    underscore.each(issues, function (issue) {
      if (issue.reason) {
        issue.reason = escapeForXml(issue.reason);
      }
      if (issue.evidence) {
        issue.evidence = escapeForXml(issue.evidence);
      }
    });

    files.push({
      'name': fs.realpathSync(file),
      'issues': report.files[file]
    });

  });

  return underscore.template(templates['jslint-xml'], {
    'report': files
  });
}

/**
 * Only report on errors
 *
 * @param  {Object} report [description]
 * @return {String}        [description]
 */
function errorsOnly(report) {
  return underscore.template(templates['errors-only'], {
    'report': report
  });
}

module.exports = {
  'standard': standard,
  'junitXml': junitXml,
  'jslintXml': jslintXml,
  'errorsOnly': errorsOnly,
  'checkstyle': checkstyle
};
