var vows = require('vows')
	, assert = require("assert")
	, init = require("../Config").Config
	;

var tooltip = function(){
	return this.suite.browser.window.ch.instances[this.suite.component][0];
}

// Init the test's suite
var suite = {
	"[ TOOLTIP ]": {
		topic: tooltip,
		"Check if the tooltip is attaching the container": function(check){
			check.show();
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(isContainer);
		}
	},
	"[ TOOLTIP ] Tooltip points lt lb": {
		topic: function(){
			return	this.suite.browser.window.ch.instances[this.suite.component][1];
		},
		"Check if the Tooltip is adding the css class when points is set": function(check){
			check.show();
			var isClassSet = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+".ch-left.ch-bottom")!==undefined?true:false;
			assert.isTrue(isClassSet);
		}
	},
	"[ TOOLTIP ] Tooltip points lb lt": {
		topic: function(){
			return	this.suite.browser.window.ch.instances[this.suite.component][2];
		},
		"Check if the Tooltip is adding the css class when points is set": function(check){
			check.show();
			var isClassSet = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+".ch-left.ch-top")!==undefined?true:false;
			assert.isTrue(isClassSet);
		}
	},
	"[ TOOLTIP ] Tooltip points lt rt": {
		topic: function(){
			return	this.suite.browser.window.ch.instances[this.suite.component][3];
		},
		"Check if the Tooltip is adding the css class when points is set": function(check){
			check.show();
			var isClassSet = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+".ch-right")!==undefined?true:false;
			assert.isTrue(isClassSet);
		}
	},
	"[ TOOLTIP ] Tooltip points rt rb": {
		topic: function(){
			return	this.suite.browser.window.ch.instances[this.suite.component][4];
		},
		"Check if the Tooltip is adding the css class when points is set": function(check){
			check.show();
			var isClassSet = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+".ch-right.ch-bottom")!==undefined?true:false;
			assert.isTrue(isClassSet);
		}
	},
	"[ TOOLTIP ] Tooltip points rt rb": {
		topic: function(){
			return	this.suite.browser.window.ch.instances[this.suite.component][5];
		},
		"Check if the Tooltip is adding the css class when points is set": function(check){
			check.show();
			var isClassSet = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+".ch-right.ch-top")!==undefined?true:false;
			assert.isTrue(isClassSet);
		}
	}
	
};

exports.suite = suite;