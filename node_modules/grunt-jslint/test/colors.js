/*jslint node:true, es5:true*/

'use strict';

var vows = require('vows');

var assert = require('assert');

var suite = vows.describe('colors');

/**
 * Run assertions for a color
 *
 * @param  {String} color
 */
function test(color) {

  var string = 'hi';

  // not enumerable
  assert.isFalse(string.hasOwnProperty(color));

  // existance
  assert.ok(string[color]);

  // keeps the string
  assert.include(string[color], string);

}

suite.addBatch({
  'additions': {
    topic: function () {
      return require('../lib/colors.js');
    },
    'should add "black"': function () {
      test('black');
    },
    'should add "blue"': function () {
      test('blue');
    },
    'should add "cyan"': function () {
      test('cyan');
    },
    'should add "green"': function () {
      test('green');
    },
    'should add "grey"': function () {
      test('grey');
    },
    'should add "magenta"': function () {
      test('magenta');
    },
    'should add "red"': function () {
      test('red');
    },
    'should add "white"': function () {
      test('white');
    },
    'should add "yellow"': function () {
      test('yellow');
    }
  }
});

suite.export(module);
