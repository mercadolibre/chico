var vows = require('vows')
	, assert = require("assert")
	, init = require("../libs/tester/Config").Config
	;

// Init the test's suite
var suite = {
		"[ OBJECT ] Check on, once, off and trigger are functions": {
			topic: function(){
				if(this.suite.standalone){
					var instance = this.suite.browser.window.ch["object"].call({ 
						type: "uiobject",
						uid: 0,
						conf: {}
					});
				} else {
					var instance = this.suite.browser.window.ch.instances[this.suite.component][0];
				}	
				return instance;
			},
			"Check for on": function(check){

				assert.isFunction(check.on);
			},
			"Check for once": function(check){

				assert.isFunction(check.once);
			},
			"Check for off": function(check){

				assert.isFunction(check.off);
			},
			"Check for trigger": function(check){

				assert.isFunction(check.trigger);
			}

		},
		"[ OBJECT ] Check if on, once, off and trigger works": {
			topic: function(){
				var obj = {
					on: 0,
					once: 0,
					off: 0
				};
				var instance = this.suite.browser.window.ch.object.call({});
					instance.on("test-on",function(){obj.on +=1;});
					instance.once("test-once",function(){obj.once += 1;});
					instance.on("test-off",function(){obj.off += 1;});

				return {
					"instance": instance,
					"obj": obj
				};
			},
			"Check if triggers and on method works": function(check){
				check.instance.trigger("test-on");
				check.instance.trigger("test-on");
				assert.equal(check.obj.on,2);
			},
			"Check if triggers and once method works": function(check){
				check.instance.trigger("test-once");
				check.instance.trigger("test-once");
				assert.equal(check.obj.once,1);
			},
			"Check if off works": function(check){
				check.instance.off("test-off");
				check.instance.trigger("test-off");
				assert.equal(check.obj.off,0);
			}
		}
	};

exports.suite = suite;