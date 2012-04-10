var vows = require('vows')
	, assert = require("assert")
	, init = require("../libs/tester/Config").Config
	;

var modalLink = function(){
	return this.suite.browser.window.ch.instances[this.suite.component][0];
}

var modalSubmit = function(){
	return this.suite.browser.window.ch.instances[this.suite.component][1];
}

// Init the test's suite
var suite = {
	"[ MODAL ] Link Check show() and hide()": {
		topic: modalLink,
		"Check if the show() method works": function(check){
			check.show();
			assert.equal( this.suite.browser.document.querySelectorAll(".ch-"+check.type+"-content").length, 1 );
		},
		"Check if the hide() method works": function(check){
			check.hide();
			assert.equal( this.suite.browser.document.querySelectorAll(".ch-"+check.type+"-content").length, 0 );		
		}
	},
	"[ MODAL ] Submit Check show() and hide()": {
		topic: modalSubmit,
		"Check if the show() method works": function(check){
			check.show();
			assert.equal( this.suite.browser.document.querySelectorAll(".ch-"+check.type+"-content").length, 1 );
		},
		"Check if the hide() method works": function(check){
			check.hide();
			assert.equal( this.suite.browser.document.querySelectorAll(".ch-"+check.type+"-content").length, 0 );		
		},
		"Submit on the button": function(check){
			this.suite.browser.fire("click", this.suite.browser.document.querySelector("#modalSubmit"));
			assert.equal( this.suite.browser.document.querySelectorAll(".ch-"+check.type+"-content").length, 1 );		
		}
	}
};

exports.suite = suite;