var vows = require('vows')
	, assert = require("assert")
	, init = require("../libs/tester/Config").Config
	;


var topic = function (conf) {
	var conf = conf || {};
	return function () {
		var instance = {};
		
		if(this.suite.standalone){
			
			// Sets a element for the abstract uiobject
			var $ = this.suite.browser.window.$;
			var $ELEMENT = $("<article><p>Expand</p><div>This is the content.</div></article>");
			var ELEMENT = $ELEMENT[0];

			// It instances a abastract component to test standalone
			instance = this.suite.browser.window.ch.controllers.call({ 
				type: "controllers",
				uid: 0,
				$element: $ELEMENT,
				element: ELEMENT,
				conf: conf
			});

			return instance;

		} else {

			var load = conf.icon===false ? 1 : ( conf.open ? 2 : 0 );
			return this.suite.browser.window.ch.instances[this.suite.component][load];
		}
	};
}



// Init the test's suite
var suite = {
	"[ CONTROLLERS ]": {
		topic: topic(),
		"Children Array exist?": function(check){
			assert.isTrue( check.children!==undefined );
		},
		"Children length equal 0": function(check){
			assert.equal( check.children.length, 0 );
		}
	}
};

exports.suite = suite;