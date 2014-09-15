'use strict';

var grunt = require('grunt');
var path = require('path');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.git_deploy = {
  setUp: function(done) {
    grunt.util.spawn({
      cmd: 'git',
      args: ['checkout', 'gh-pages'],
      opts: {cwd: 'tmp/repo'}
    }, done);
  },
  default_options: function(test) {
    test.expect(3);

    grunt.file.recurse('test/fixtures/second', function(abs, root, subdir, file) {
      var relativePath = path.join(subdir || '', file);
      test.ok(grunt.file.exists(path.join('tmp/repo', relativePath)), 'The file ‘' + relativePath + '’ should have been copied into the repository.');
    });

    test.done();
  }
};
