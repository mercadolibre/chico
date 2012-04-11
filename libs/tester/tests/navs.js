var vows = require('vows')
	, assert = require("assert")
	, init = require("../Config").Config
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
			instance = this.suite.browser.window.ch.navs.call({ 
				type: "navs",
				uid: 0,
				$element: $ELEMENT,
				element: ELEMENT,
				conf: conf
			});

			instance = instance["public"];
			return instance;

		} else {

			var load = conf.icon===false ? 1 : ( conf.open ? 2 : 0 );
			return this.suite.browser.window.ch.instances[this.suite.component][load];
		}
	};
}



// Init the test's suite
var suite = {
	"[ NAVS ] Check default navs": {
		topic: topic(),
		"Check if the component sets true as active when shows the content": function(check){
			check.show();
			assert.isTrue( check.isActive() );
		},
		"Check if the component sets false as active when hides the content": function(check){
			check.hide();
			assert.isTrue( !check.isActive() );
		},
		"Check if the icon is added": function(check){
			var isIcon = check.element.querySelector(".ch-"+check.type+"-ico")!==undefined?true:false;
			assert.isTrue( isIcon );
		}
	},
	"[ NAVS ] Check no icon navs": {
		topic: topic( { icon: false } ),
		"Check if the icon is added": function(check){
			var noIcon = check.element.querySelector(".ch-"+check.type+"-ico")===undefined?true:false;
			assert.isTrue( noIcon );
		}
	},
	"[ NAVS ] Check open by default navs": {
		topic: topic( { open: true } ),
		"Check if the component is visible by default": function(check){
			assert.isTrue( check.isActive() );
		}
	}
};

exports.suite = suite;