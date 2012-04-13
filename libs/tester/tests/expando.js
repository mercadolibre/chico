var vows = require('vows')
	, assert = require("assert")
	, init = require("../Config").Config
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
	"[ EXPANDO ] Default": {
		topic: topic(),
		"Check if the expando is attaching the container": function(check){
			check.show();
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(isContainer);
		}
	},
	"[ EXPANDO ] Icon false": {
		topic: topic({ icon: false }),
		"Check if the expando is attaching the container": function(check){
			check.show();
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(isContainer);
		}
	},
	"[ EXPANDO ] Open true": {
		topic: topic({ open: true }),
		"Check if the expando is attaching the container": function(check){
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(isContainer);
		}
	}
};

exports.suite = suite;