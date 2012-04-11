var Browser = require("zombie")
	, vows = require('vows')
	, assert = require("assert")
	, events = require('events')
	, init = require("./Config").Config
	, INHERITANCE_MAP = init.INHERITANCE_MAP
	;

	// Browser global configuration
	Browser.site = "http://ui.ml.com/libs/tester/tests/";
	//Browser.site = "file://"+process.cwd()+"/tests/";
	Browser.debug = false;
	//Browser.waitFor = 0.3;

var Test = function(conf){
	var self = this;
		// The name of the test
		self.name = conf.name;

		// files has the first letter in lowercase
		self.test = conf.test || (self.name.replace(self.name[0],self.name[0].toLowerCase()));

		// component has the first letter in uppercase
		self.component = conf.component || (self.name.replace(self.name[0],self.name[0].toUpperCase()));

		// The url with the component to test
		self.url = conf.url;

		// The suite that will be tested
		self.suite = vows.describe("Test " + self.name);

		self.standalone = conf.standalone || false;

		self.result = {};

		self.inheritanceMap = INHERITANCE_MAP;



		self.compileSuite();

	return self;
}

Test.prototype = new events.EventEmitter();

Test.prototype.getResult = function(){
	return this.result;
}

Test.prototype.setResult = function(result){
	this.result = result;
	return this.result;
}

Test.prototype.compileSuite = function(){
	var self = this;

		var component = self.component,
			test = self.test;

		if(!component){
			return;
		}

		var loadComponent = function(component){
			

			var test = (component.replace(component[0],component[0].toLowerCase()))

			// get the tests for the
			//var batches = require("../../tests/"+test+".js").suite;
			var batches = require("./tests/"+test+".js").suite;
				
				// add the suite to the test to the suite
				self.suite.addBatch(batches);

			// exit if the 
			if(!self.inheritanceMap[component].augments){
				//var batches = require("../../tests/core.js").suite;
				var batches = require("./tests/core.js").suite;
					self.suite.addBatch(batches);
					self.suite.batches = self.suite.batches.reverse();
					
					//console.dir(self.suite.batches.reverse());

				return;
			}

			// find the upper level to test
			var newComponent = self.inheritanceMap[component].augments;

				loadComponent(newComponent);	
		}


		loadComponent(component);

	return;

}

Test.prototype.run = function(cbk){
	var self = this;
	var browser = new Browser();
	
	// Callback of the load of the page
	var callback = function(e,browser){
		// Where the errors or running test will be concatened
		var status = "";
		// Internal's callback browser 
		var browser = browser;

		// If there are errors 
		if(browser.errors.length!==0){
			status = "[ ERRORS ]\n";

			// Event
			self.emit("browserError");

			// Concatening the errors
			browser.errors.forEach(function(e,i){
				status += " * " + e + "\n";	
			});

			// Feedback throw the command line
			console.log(status);

		} else {

			// Reference to the response browser
			self.suite.browser = self.browser = browser;

			self.suite.standalone = self.standalone;
			self.suite.component = self.name;

			// Running the test's suite
			self.suite.run(browser,function(result){
				result.name = self.name;
				result.browserErrors = browser.errors;
				result.url = browser.site + self.url;
				
				self.setResult(result);
				self.emit("end");
			});

			// Event
			self.emit("run");

		}
	}

	// Browses the page to test

	browser.visit(self.url,callback);

	return self;	
}


exports.Test = Test;