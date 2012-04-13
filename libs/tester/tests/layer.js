var vows = require('vows')
	, assert = require("assert")
	, init = require("../Config").Config
	;

var layerClick = function(){
	return this.suite.browser.window.ch.instances[this.suite.component][0];
}

var layerClickButton = function(){
	return this.suite.browser.window.ch.instances[this.suite.component][1];
}

var layer = function(){
	return this.suite.browser.window.ch.instances[this.suite.component][2];
}

var layerLink = function(){
	return this.suite.browser.window.ch.instances[this.suite.component][3];
}



// Init the test's suite
var suite = {
	"[ LAYER ] Layer click": {
		topic: layerClick,
		"Check if the layer is attaching the container": function(check){
			check.show();
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(isContainer);
		},
		"Check if the layer is showing the close button": function(check){
			var isClose = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+" .ch-close")!==undefined?true:false;
			assert.isTrue(isClose);
		},
		"Check if the layer is deattaching the container": function(check){
			check.hide();
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(!isContainer);
		}
	},
	"[ LAYER ] Layer click button": {
		topic: layerClickButton,
		"Check if layer is attaching the container": function(check){
			check.show();
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(isContainer);
		},
		"Check if the layer is showing the close button": function(check){
			var isClose = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+" .ch-close")!==undefined?true:false;
			assert.isTrue(isClose);
		},
		"Check if layer is deattaching the container": function(check){
			check.hide();
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(!isContainer);
		}
	},
	"[ LAYER ] Layer": {
		topic: layer,
		"Check if layer is attaching the container": function(check){
			check.show();
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(isContainer);
		},
		"Check if the layer is showing the close button": function(check){
			var isNtClose = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+" .ch-close")===undefined?true:false;
			assert.isTrue(isNtClose);
		},
		"Check if layer is deattaching the container": function(check){
			check.hide();
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(!isContainer);
		}
	},
	"[ LAYER ] Layer link": {
		topic: layerLink,
		"Check if layer is attaching the container": function(check){
			check.show();
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(isContainer);
		},
		"Check if the layer is showing the close button": function(check){
			var isNtClose = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+" .ch-close")===undefined?true:false;
			assert.isTrue(isNtClose);
		},
		"Check if layer is deattaching the container": function(check){
			check.hide();
			var isContainer = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid)!==undefined?true:false;
			assert.isTrue(!isContainer);
		}
	},
	"[ LAYER ] Layer points lt lb": {
		topic: function(){
			return	this.suite.browser.window.ch.instances[this.suite.component][4];
		},
		"Check if the layer is adding the css class when points is set": function(check){
			check.show();
			var isClassSet = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+".ch-left.ch-bottom")!==undefined?true:false;
			assert.isTrue(isClassSet);
		}
	},
	"[ LAYER ] Layer points lb lt": {
		topic: function(){
			return	this.suite.browser.window.ch.instances[this.suite.component][5];
		},
		"Check if the layer is adding the css class when points is set": function(check){
			check.show();
			var isClassSet = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+".ch-left.ch-top")!==undefined?true:false;
			assert.isTrue(isClassSet);
		}
	},
	"[ LAYER ] Layer points lt rt": {
		topic: function(){
			return	this.suite.browser.window.ch.instances[this.suite.component][6];
		},
		"Check if the layer is adding the css class when points is set": function(check){
			check.show();
			var isClassSet = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+".ch-right")!==undefined?true:false;
			assert.isTrue(isClassSet);
		}
	},
	"[ LAYER ] Layer points rt rb": {
		topic: function(){
			return	this.suite.browser.window.ch.instances[this.suite.component][7];
		},
		"Check if the layer is adding the css class when points is set": function(check){
			check.show();
			var isClassSet = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+".ch-right.ch-bottom")!==undefined?true:false;
			assert.isTrue(isClassSet);
		}
	},
	"[ LAYER ] Layer points rt rb": {
		topic: function(){
			return	this.suite.browser.window.ch.instances[this.suite.component][8];
		},
		"Check if the layer is adding the css class when points is set": function(check){
			check.show();
			var isClassSet = this.suite.browser.document.querySelector("#ch-"+check.type+"-"+check.uid+".ch-right.ch-top")!==undefined?true:false;
			assert.isTrue(isClassSet);
		}
	}
	
};

exports.suite = suite;