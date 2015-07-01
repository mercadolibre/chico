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

var suite = vows.describe('templates');

suite.addBatch({
  'sanity': {
    topic: function () {
      return require('../lib/templates');
    },
    'should be an object': function (templates) {
      assert.isObject(templates);
    },
    'should have multiple keys': function (templates) {
      assert.ok(Object.keys(templates).length);
    },
    'should contain an "errors-only" template': function (templates) {
      assert.include(templates, 'errors-only');
    },
    'should contain an "standard" template': function (templates) {
      assert.include(templates, 'standard');
    },
    'should contain an "jslint-xml" template': function (templates) {
      assert.include(templates, 'jslint-xml');
    },
    'should contain a "checkstyle" template': function (templates) {
      assert.include(templates, 'checkstyle');
    },
    'should contain an "junit-xml" template': function (templates) {
      assert.include(templates, 'junit-xml');
    }
  }
});

suite.export(module);
