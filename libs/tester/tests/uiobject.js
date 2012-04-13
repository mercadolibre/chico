var vows = require('vows')
	, assert = require("assert")
	//, init = require("../Config").Config
	, init = require("../Config").Config
	;

var topic = function(){
	
	return function(){
		var instance = {};

		if(this.suite.standalone){
			
			// Sets a element for the abstract uiobject
			var $ELEMENT = this.suite.browser.window.$("<a>");
			var $CONTENT = this.suite.browser.window.$("<div>");

			// It instances a abastract component to test standalone
			instance = this.suite.browser.window.ch.uiobject.call({ 
				type: "uiobject",
				uid: 0,
				active: true,
				source: "pepe",
				$element: $ELEMENT,
				$content: $CONTENT,
				conf: {}
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
		"[ UIOBJECT ] Public content method": {
			topic: topic(),
			"Check if string is set like content": function(check){
				
				if( check.type!=="uiobject" ){

					check.show();
				}
				check.content("This is only a test");
				assert.equal(check.content(),"This is only a test");
				//check.hide();
			},
			"Check if DOM Element is set as a content": function(check){
				
				if( check.type!=="uiobject" ){
					check.show();
				}
				check.content("#test");
				assert.equal(check.content().text(),"This is only a DOM content test.");
				
			},
			"Check if URL is set as a content": function(check){
				check.checkURL = false;
				check.on("contentLoad",function(){this.checkURL = true;});

				if( check.type!=="uiobject" ){
					check.show();
				}
				check.content("http://ui.ml.com/tests/test-ajax.html");	
				
				
				this.suite.browser.wait(function(){ return check.checkURL;},function(){
					//console.log("checkURL " + check.checkURL);
					assert.isTrue(check.checkURL);
					
					
				});
			}
		}
	};

exports.suite = suite;
//exports.batches =
	








