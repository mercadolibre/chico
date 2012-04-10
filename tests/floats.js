var vows = require('vows')
	, assert = require("assert")
	, init = require("../libs/tester/Config").Config
	;

var topic = function(){
	
	return function(){
		var instance = {};

		if(this.suite.standalone){
			
			// Sets a element for the abstract uiobject
			var $ELEMENT = this.suite.browser.window.$("<a>");
			var ELEMENT = $ELEMENT[0];
			var $CONTENT = this.suite.browser.window.$("<div>");

			// It instances a abastract component to test standalone
			instance = this.suite.browser.window.ch.floats.call({ 
				type: "floats",
				uid: 1,
				active: false,
				source: "pepe",
				$element: $ELEMENT,
				element: ELEMENT,
				$content: $CONTENT,
				conf: {
					aria: { role: "tooltip" }
				}
			});
			instance = instance["public"];
		} else {

			// It test about the first intances in de html document
			instance = this.suite.browser.window.ch.instances[this.suite.component][0];
		}

		return instance;
	}

}



// Init the test's suite
var suite = {
		"[ FLOATS ] Check width() and height() methods": {
			topic: topic(),
			"Check if the width() method returns an object": function(check){
				assert.isObject(check.width());
			},
			"Check if the height() method returns an object": function(check){
				assert.isObject(check.height());
			}
		},
		"[ FLOATS ] Check show() and isActive() methods": {
			topic: topic(),
			"Check if the isActive() method works on show() method returning true": function(check){
				check.show();
				assert.isTrue(check.isActive());
			},
			"Check if the show() method works": function(check){
				check.show();
				var $ = this.suite.browser.window.$;
				assert.equal($(".ch-"+check.type+"-content").length,1);
			}
		},
		"[ FLOATS ] Check contentLoad() method": {
			topic: topic(),
			"Check if the contentLoad callback works": function(check){
				check.worksContentLoad = false;
				check.on("contentLoad",function(){ this.worksContentLoad = true; });
				
				check.show();
				check.content("http://ui.ml.com/tests/test-ajax.html");

				this.suite.browser.wait(check.worksContentLoad,function(){
					assert.isTrue(check.worksContentLoad);
				});

			}
		},
		"[ FLOATS ] Check contentError() method": {
			topic: topic(),
			"Check if the contentError callback works": function(check){
				check.worksContentError = false;
				check.on("contentError",function(){ this.worksContentError = true; });
				
				check.show();
				check.content("http://ui.ml.com/tests/error.html");

				this.suite.browser.wait(check.worksContentError,function(){
					assert.isTrue(check.worksContentError);
				});

			}
		},
		"[ FLOATS ] Check hide() methods": {
			topic: topic(),
			"Check if the isActive() method works on hide() returning false": function(check){
				check.hide();
				assert.isTrue(!check.isActive());
			}
		}
		

	};

exports.suite = suite;
//exports.batches =
	








