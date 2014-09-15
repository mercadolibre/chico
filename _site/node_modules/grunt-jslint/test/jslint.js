/*jslint node:true, es5:true*/
/*jslint unparam: true, indent: 2 */

'use strict';
var ROOT = (function () {
  /*jslint nomen:true*/
  return __dirname;
}());

var path = require('path');

var vows = require('vows');

var assert = require('assert');

var validate = require('../lib/jslint.js');

var suite = vows.describe('validate');

suite.addBatch({
  'no directives': {
    topic: function () {
      var file = path.join(ROOT, 'fixtures', 'white.js');
      validate(file, {}, this.callback);
    },
    'should not error': function (err, report) {
      assert.ifError(err);
    },
    'should pass an Array of issues': function (err, report) {
      assert.isArray(report);
      assert.ok(report.length);
    },
    'should contain required issue properties': function (err, report) {
      report.forEach(function (issue) {
        assert.ok(issue.id);
        assert.ok(issue.raw);
        assert.ok(issue.evidence);
        assert.ok(issue.line);
        assert.ok(issue.character);
        assert.ok(issue.reason);
        assert.ok(issue.fileName);
        assert.ok(issue.file);
      });
    },
    'should report at least 9 issues': function (err, report) {
      // as of 12-21-12, there are 12 issues in this file.  i'm not
      // directly testing each issue, because i believe jslint works as
      // expected.  also, crockford may decide to change his mind
      // regarding one or more of the reported issues in this file.
      assert.ok(report.length >= 9);
    }
  },
  'directives:': {
    'white': {
      topic: function () {
        var file = path.join(ROOT, 'fixtures', 'white.js');
        validate(file, {
          'directives': {
            'white': true
          }
        }, this.callback);
      },
      'should not error': function (err, report) {
        assert.ifError(err);
      },
      'should pass an empty Array': function (err, report) {
        assert.isArray(report);
        assert.lengthOf(report, 0);
      }
    },
    'sloppy': {
      topic: function () {
        var file = path.join(ROOT, 'fixtures', 'sloppy.js');
        validate(file, {
          'directives': {
            'sloppy': true
          }
        }, this.callback);
      },
      'should not error': function (err, report) {
        assert.ifError(err);
      },
      'should pass an empty Array': function (err, report) {
        assert.isArray(report);
        assert.lengthOf(report, 0);
      }
    }
  },
  'shebang option': {
    topic: function () {
      var file = path.join(ROOT, 'fixtures', 'shebang');
      validate(file, { shebang: true }, this.callback);
    },
    'should not error': function (err, report) {
      assert.ifError(err);
    },
    'should pass an empty Array': function (err, report) {
      assert.isArray(report);
      assert.lengthOf(report, 0);
    }
  },
  'missing file': {
    topic: function () {
      validate('cats and dogs', {}, this.callback);
    },
    'should error': function (err, report) {
      assert.ok(err instanceof Error);
    }
  }
});

suite.export(module);
