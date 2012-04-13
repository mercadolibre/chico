var vows = require('vows')
	, assert = require("assert")
	//, init = require("../Config").Config
	, init = require("../Config").Config
	;

// Init the test's suite
var suite = {
		"Check core functionality": {
			topic: function(){
				return this.suite.browser;
			},
			"Does ch exist?": function(browser){
				assert.isTrue(browser.window.ch!==undefined);
			},
			"Is ch an Object?": function(browser){
				assert.isObject(browser.window.ch);
			},
			"Is it the correct version?": function(browser){
				assert.equal(browser.window.ch.version,init.version);
			},
			"Check for critical components":{
				"Does ch.factory exist?": function(browser){
					assert.isTrue(browser.window.ch.factory!==undefined);		
				},
				"Is ch.factory a function?": function(browser){
					assert.isFunction(browser.window.ch.factory);		
				},
				"Does ch.get exist?": function(browser){
					assert.isTrue(browser.window.ch.get!==undefined);		
				},
				"Is ch.get a function?": function(browser){
					assert.isFunction(browser.window.ch.get);		
				}
			}
		},
		"Checks ch inside.": {
			topic: function(){
				return this.suite.browser;
			},	
			"Check ch.instances porperty":{
				"Does ch.instances exist?": function(browser){
					assert.isTrue(browser.window.ch.instances!==undefined);		
				}
			},
			"Check ch.events map":{
				"Do KEY, LAYOUT and VIEWPORT exist?": function(browser){
					assert.isTrue(
						browser.window.ch.events.KEY!==undefined && 
						browser.window.ch.events.LAYOUT!==undefined && 
						browser.window.ch.events.VIEWPORT!==undefined
					);
				},
				"Is KEY, LAYOUT and VIEWPORT an Object?": function(browser){
					assert.isObject(browser.window.ch.events.KEY);
					assert.isObject(browser.window.ch.events.LAYOUT);
					assert.isObject(browser.window.ch.events.VIEWPORT);
				}
			},
			"isArray": {
				"is it a function?": function(browser){
					assert.isFunction(browser.window.ch.utils.isArray);
				},
				"is it working?": function(browser){
					assert.isTrue(browser.window.ch.utils.isArray(["a","b"]));
				}
			}
		}

	};

exports.suite = suite;
	








