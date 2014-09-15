/*jslint node:true, es5:true*/
/*jslint unparam: true, indent: 2 */

'use strict';

var path = (function () {
  var p = require('path');

  return function (fixture) {
    /*jslint nomen:true*/
    return p.join(__dirname, 'fixtures', fixture);
  };

}());

var vows = require('vows');

var Parser = require('xml2js').Parser;

var assert = require('assert');

var runner = require('../lib/runner.js');

var reports = require('../lib/reports.js');

var suite = vows.describe('reporters');


//
// TODO
// - much better coverage
// - reduce code repetition
//

suite.addBatch({
  'standard': {
    topic: function () {
      var callback = this.callback;

      runner([ path('sloppy.js'), path('white.js') ], {}, function (err, report) {
        callback(err, reports.standard(report));
      });
    },
    'should not have errored': function (err, result) {
      assert.ifError(err);
    },
    // extremely low coverage here...
    'should return a String': function (err, result) {
      assert.isString(result);
    }
  },
  'checkstyle': {
    topic: function () {
      var callback = this.callback;

      runner([ path('sloppy.js'), path('white.js') ], {}, function (err, report) {
        callback(err, reports.checkstyle(report));
      });
    },
    'should not have errored': function (err, result) {
      assert.ifError(err);
    },
    // extremely low coverage here...
    'should return a String': function (err, result) {
      assert.isString(result);
    }
  },
  'junit-xml': {
    topic: function () {
      var callback = this.callback;

      runner([ path('sloppy.js'), path('white.js') ], {}, function (err, report) {
        callback(err, reports.junitXml(report));
      });
    },
    'should not have errored': function (err, result) {
      assert.ifError(err);
    },
    // extremely low coverage here...
    'should return a String': function (err, result) {
      assert.isString(result);
    }

  },
  'jslint-xml': {
    topic: function () {
      var callback = this.callback;

      runner([ path('sloppy.js'), path('white.js') ], {}, function (err, report) {
        callback(err, reports.jslintXml(report));
      });
    },
    'should not have errored': function (err, result) {
      assert.ifError(err);
    },
    // extremely low coverage here...
    'should return a String': function (err, result) {
      assert.isString(result);
    }

  },
  'errors-only': {
    topic: function () {
      var callback = this.callback;

      runner([ path('sloppy.js'), path('white.js') ], {}, function (err, report) {
        callback(err, reports.errorsOnly(report));
      });
    },
    'should not have errored': function (err, result) {
      assert.ifError(err);
    },
    // extremely low coverage here...
    'should return a String': function (err, result) {
      assert.isString(result);
    }
  },
  'outputted xml:': {
    'checkstyle': {
      topic: function () {
        var parser = new Parser(),
          callback = this.callback;

        runner([ path('sloppy.js'), path('white.js'), path('var.js') ], {}, function (err, report) {
          assert.ifError(err);
          parser.parseString(reports.checkstyle(report), callback);
        });
      },
      'should not error': function (err, xml) {
        assert.ifError(err);
      },
      'should use the "checkstyle" namespace': function (err, xml) {
        assert.ok(xml.checkstyle);
      },
      'should contain three file nodes': function (err, xml) {
        assert.lengthOf(xml.checkstyle.file, 3);
      },
      'should contain an error node for each file': function (err, xml) {
        xml.checkstyle.file.forEach(function (file) {
          assert.includes(file, 'error');
          assert.ok(file.error.length);
        });
      },
      'each error should contain all required attributes': function (err, xml) {
        xml.checkstyle.file.forEach(function (file) {
          file.error.forEach(function (error) {
            error = error.$;
            // must contain these attributes.  they may be empty (""),
            // so we're not testing truthy-ness
            assert.includes(error, 'line');
            assert.includes(error, 'column');
            assert.includes(error, 'severity');
            assert.includes(error, 'message');
            assert.includes(error, 'source');
          });
        });
      }
    },
    'jslint': {
      topic: function () {
        var parser = new Parser(),
          callback = this.callback;

        runner([ path('sloppy.js'), path('white.js'), path('var.js') ], {}, function (err, report) {
          assert.ifError(err);
          parser.parseString(reports.jslintXml(report), callback);
        });
      },
      'should not error': function (err, xml) {
        assert.ifError(err);
      },
      'should use the "jslint" namespace': function (err, xml) {
        assert.ok(xml.jslint);
      },
      'should contain three file nodes': function (err, xml) {
        assert.lengthOf(xml.jslint.file, 3);
      },
      'should contain an issue node for each file': function (err, xml) {
        xml.jslint.file.forEach(function (file) {
          assert.includes(file, 'issue');
          assert.ok(file.issue.length);
        });
      },
      'each error should contain all required attributes': function (err, xml) {
        xml.jslint.file.forEach(function (file) {
          file.issue.forEach(function (issue) {
            issue = issue.$;
            assert.includes(issue, 'line');
            assert.includes(issue, 'char');
            assert.includes(issue, 'evidence');
            assert.includes(issue, 'reason');
          });
        });
      }
    },
    'junit': {
      topic: function () {
        var parser = new Parser(),
          callback = this.callback;

        runner([ path('sloppy.js'), path('white.js'), path('var.js') ], {}, function (err, report) {
          assert.ifError(err);
          parser.parseString(reports.junitXml(report), callback);
        });
      },
      'should not error': function (err, xml) {
        assert.ifError(err);
      },
      'should use the "testsuites" namespace': function (err, xml) {
        assert.ok(xml.testsuites);
      },
      'should contain one "testsuite" node': function (err, xml) {
        assert.ok(xml.testsuites.testsuite);
        assert.lengthOf(xml.testsuites.testsuite, 1);
      },
      'should contain the "testcase" namespace': function (err, xml) {
        assert.ok(xml.testsuites.testsuite[0].testcase);
      },
      'testcases': {
        // vows doesn't pass the error to a sub-set of vows?
        topic: function (xml) {
          return xml.testsuites.testsuite[0].testcase;
        },
        // should start with a letter (not a dot)
        // should strip '.js'
        // should do this stuff too:
        // http://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html
        'should have "valid" pseudo-classnames (package name)': function (testcases) {
          testcases.forEach(function (testcase) {
            var classname = testcase.$.classname,
              first = classname[0],
              last = classname[classname.length - 1],
              extension = classname[classname.length - 3];

            assert.notEqual(first, '.');
            assert.notEqual(last, '.');
            assert.notEqual(extension.toLowerCase(), '.js');
            assert.equal(-1, classname.indexOf('/'));
            assert.equal(-1, classname.indexOf('-'));
          });
        },
        // TODO do JUnit-style testnames have to be unique?  does Jenkins barf when they're not?
        'should have a (somewhat) unique test name': function (testcases) {
          testcases.forEach(function (testcase) {
            var name = testcase.$.name;

            assert.includes(name, ':');

            // test name is  `<filename>:<line>:<char>`
            assert.match(name, /^[a-z]+\.js\:\d\:[\d]+$/i);
          });
        },
        'each testcase should only contain one failure': function (testcases) {
          testcases.forEach(function (testcase) {
            assert.lengthOf(testcase.failure, 1);
          });
        },
        'each failure should have a message': function (testcases) {
          testcases.forEach(function (testcase) {
            var failure = testcase.failure[0].$;

            assert.includes(failure, 'message');
            assert.isString(failure.message);
          });
        }
      }
    }
  }
});

suite.export(module);
