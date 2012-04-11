var init = require("./Config").Config
	, Test = require("./Test").Test
	, assert = require("assert")
	, events = require('events')
	, fs = require('fs')
	, INHERITANCE_MAP = init.INHERITANCE_MAP
	;



// Tester
var Tester = function(argv){
	// The paramas passed throw the console
	//var params = process.argv;
	var params = argv;

	var self = this;
		self.testsDone = [];
		self.RESULTS_FILE = "./tests/index.html";
		self.inheritanceMap = INHERITANCE_MAP;

	// If params are some components
	if(params[2]!=="all" && params.length>2){

		// The list of components listed in the command line
		var toRun = params.slice(2,params.length);

	} else {

		// Get all components
		var toRun = init.widgets.all;
	}

	// Run test for each component listed in the command line
	toRun.forEach(function(component,index){

		// Checks for the component exist
		if(init.widgets.all.indexOf(component)>0){
			self.runTest(component);
		}

	});

	// Checks if the results list is equal to test to run and write the file
	self.on("resultAdded",function(){
		if(toRun.length===self.testsDone.length){
			console.dir("[ DONE ]");
			self.writeResult();
		}
	});	
	
	return self;	
}

Tester.prototype = new events.EventEmitter();

Tester.prototype.addResult = function(result){
	var self = this;
		self.testsDone.push(result)
		self.emit("resultAdded");
}

Tester.prototype.writeResult = function(){
	var self = this;
	var html = "<h1>Test results</h1><pre style=\"width:200px;\">";
		html += JSON.stringify(self.testsDone);
		html += "</pre>"

		fs.writeFile(self.RESULTS_FILE,html,enconding="utf8",function( err ) {
			if(err) {
				sys.puts(err);
			}
		});


}

Tester.prototype.runTest = function(component){
	var self = this
		, file = component.replace(component[0],component[0].toLowerCase())
		, html = file+".html"
		, name = file
		, inheritance = self.inheritanceMap[component]
		, testConf = { "name": name, "url": html }
		;

		if(inheritance && (inheritance.type === "abstract" || inheritance.type === "util")){
			
			testConf = { "name": name, "url": inheritance.type+".html", "standalone": true };
		}

		// Instance the test
		var test = new Test(testConf);
			
			// Once the test is ended this will be added to the list of results
			test.on("end", function () { self.addResult( this.getResult() ); } );
			
			test.run();

	return self;
}

var test = new Tester(process.argv);

exports.Tester = Tester;






