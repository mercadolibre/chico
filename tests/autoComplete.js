var vows = require('vows')
	, assert = require("assert")
	, events = require('events')
	, init = require("../libs/tester/Config").Config
	;

// Init the test's suite
var suite = vows.describe("Test Core");

	// Check for the core funtionality batch
	suite.addBatch({
		"Check core functionality": {
			topic: function(){
					
				return suite.browser;
			},
			"Does autoComplete instance exist?": function(browser){
				assert.isTrue(suite.browser.window.ch.instances.autoComplete[0]!==undefined);
			}
		}
	});

exports.suite = suite;
	








