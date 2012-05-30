/*
* Releaser
*/

var sys = require("util"),
	fs = require("fs"),
	events = require("events"),
	exec = require("child_process").exec,
	cartographer = require("../cartographer/cartographer.js"),
	Joiner = require("../joiner/joiner").Joiner,
	Packer = require("../packer/packer").Packer;


var Releaser = function () {

	var self = this;

	sys.puts("\n************************");
	sys.puts("*       RELEASER       *");
	sys.puts("************************");
	sys.puts(" > Releaser: Ready to use.");

	return self;
};

// Event emitter
sys.inherits(Releaser, events.EventEmitter);


Releaser.prototype.addZip = function () {

	var self = this,
		
		// Construct Packer
		packer = new Packer(),
		
		output = "../../../chico.site/public/downloads";
	
	// Feedback
	sys.puts(" > Releaser: Creating the ZIP file.");

	// Listener that prints content of code
	packer.on("done", function (url) {
		
		url = url.split("/");
		
		sys.puts(" > Releaser: Adding the ZIP file to version folder.");
		
		exec("mv " + output + "/" + url[1] + "/" + url[2] + "/* " + self.folder, function (err) {

			if (err) { sys.puts(" > Releaser " + err); }
			
			// Delete temp folder
			exec("rm -rf " + output + "/" + url[1]);
			
			sys.puts(" > Releaser: ZIP file done.");
			
			self.concludeTask();
		});
	});
	
	// Initialize Packer
	packer.run({
		"widgets": ["Auto Complete", "Blink", "Calendar", "Carousel", "Countdown", "Css Library", "Date Picker", "Dropdown", "Expando", "Form", "Layer", "Menu", "Modal", "Positioner", "Tab Navigator", "Tooltip", "Validation", "Zoom"],
		"totalWidgets": "18",
		"compression": ["prod", "dev"],
		"extras": "mesh",
		"input": "../../src",
		"output": output
	});
};

Releaser.prototype.addDocs = function () {

	var self = this;
	
	// Feedback
	sys.puts(" > Releaser: Creating the API documentation of version " + self.version + " through JSDoc...");

	// Change version into JSDoc config file
	fs.readFile(__dirname + "/conf.json", function (err, data) {

		if (err) { sys.puts(" > Releaser " + err); }
		
		// Replace version number
		var content = data.toString().replace((new RegExp("[0-9]+\\.[0-9]+(\\.[0-9]+)?")), self.version);
		
		fs.writeFile(__dirname + "/conf.json", content, encoding = "utf8", function (err) {
			
			if (err) { sys.puts(" > Releaser " + err); }
			
			// Code execution
			exec("java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js -c=conf.json/ -n -u -p", function (err) {
				
				if (err) { sys.puts(" > Releaser " + err); }
				
				// Feedback
				sys.puts(" > Releaser: API Documentation done!");
				
				self.concludeTask();
			});
		});
	});
};


Releaser.prototype.pack = function () {

	var self = this;

	// Close a specific task and analize if all tasks are done
	self.concludeTask = (function () {
		
		// Total amount of tasks to be executed
		var total = 3,

		// Tasks concluded
			progress = 0;
		
		// Return the real function
		return function () {
			// Compress package when all tasks are ready
			if ((progress += 1) === total) {
				// Feedback
				sys.puts(" >>>>>>>>>>>>>>> Releaser DONE <<<<<<<<<<<<<<<");
			}
		};
	}());

	// Create a folder name to save the generated files
	self.folder = self.output + "/" + self.version;

	// Feedback
	sys.puts(" > Releaser: Creating the output folder (" + self.folder + ").");

	// Create basic structure of folders
	exec("mkdir " + self.folder, function (err) {

		if (err) { sys.puts(" > Releaser " + err); }
		
		// Task 1: 
		self.addFiles();
		
		// Task 2: 
		self.addDocs();

		// Task 3: 
		self.addZip();
	});
};


Releaser.prototype.addFiles = function () {

	var self = this,

	// Construct joiner
		joiner = new Joiner(),

	// Packages to be builded with Joiner
		packages = [
			{ "name": "chico", "type": "js" },
			{ "name": "chico", "type": "css" },
			{ "name": "chico", "type": "js", "min": true },
			{ "name": "chico", "type": "css", "min": true }
		],

	// Total of packages to build
		total = packages.length,

	// Files saved
		progress = 0;

	// Listener that prints content of code
	joiner.on("joined", function (content, pack) {

		// Name for version folder. Example: chico-min-X.X.X.js
		var file = pack.name + "-" + (pack.min ? "min-" : "") + self.version + "." + pack.type;

		// Include minified file into latest folder
		if (pack.min) {
			fs.writeFileSync(self.output + "/latest/" + pack.name + "." + pack.type, content);
		}
		
		// Put content into created file
		fs.writeFile(self.folder + "/" + file, content, encoding = "utf8", function (err) {

			if (err) { sys.puts(" > Releaser " + err); }
			
			// Feedback
			sys.puts(" > Releaser: Done " + file);
			
			// Conclude task when all files are written
			if ((progress += 1) === total) {
				self.concludeTask();
			}
		});
	});

	// Initialize joiner
	joiner.run({ "packages": packages });
};


Releaser.prototype.run = function (params) {

	var self = this;

	self.params = params;

	// Read configuration object
	fs.readFile(__dirname + "/../conf.json", function (err, data) {

		if (err) { sys.puts(" > Releaser " + err); }

		// Parse JSON data
		var conf = JSON.parse(data);

		// Grab all object properties on self context
		Object.keys(conf).forEach(function (e) {
			self[e] = conf[e];
		});
		
		// TODO: use conf file
		self.output = "../../../chico.site/public/versions";

		// Feedback
		sys.puts(" > Releaser: Initializing on v" + self.version + " of " + self.name + ".");

		self.pack();

	});
};


// Exports
exports.Releaser = Releaser;

(new Releaser).run();