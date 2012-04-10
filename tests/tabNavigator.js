var vows = require('vows')
	, assert = require("assert")
	, init = require("../libs/tester/Config").Config
	;

var topic = function(conf){
	var conf = conf || {};
	var load = conf.icon===false ? 1 : ( conf.open ? 2 : 0 );
	return function(){
		return this.suite.browser.window.ch.instances[this.suite.component][load];
	}
}

// Init the test's suite
var suite = {
	"[ TABNAVIGATOR ] Default": {
		topic: topic(),
		"Check if the dropdown is attaching the container": function(check){
			
			var isContainer = (check.element.id === check.type+"-"+(check.uid-1))?true:false;
			assert.isTrue(isContainer);
		}
	}
};

exports.suite = suite;