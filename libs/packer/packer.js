/*
* Packer
* Creates a .zip file with neccesary resourses of Chico UI.
*/

var sys = require("util"),
	fs = require("fs"),
	events = require("events"),
	exec = require("child_process").exec,
	Joiner = require("../joiner/joiner").Joiner;


var Packer = function () {

	var self = this;

	sys.puts("\n************************");
	sys.puts("*        PACKER        *");
	sys.puts("************************");
	sys.puts(" > Packer: Ready to use.");

	return self;
};

// Event emitter
sys.inherits(Packer, events.EventEmitter);


Packer.prototype.compress = function () {

	var self = this,

	// TODO: Use parameters in conf file
		zip = "chico-" + self.version + ".zip",

	// Commands to be executed
	// TODO: use "rm -r *" and prevent to delete the zip file
		bash = [
			"cd " + self.folder,
			"zip -r " + zip + " *",
			"rm -r README.md LICENSE.txt index.html assets/ js/ css/"
		].join(" && ");

	// Feedback
	sys.puts(" > Packer: Creating the zip file " + zip);

	// Execution of commands
	exec(bash, function (err) {

		if (err) { sys.puts(" > Packer " + err); }

		// Feedback
		sys.puts(" > Packer: DONE!");

		// TODO: Use a parameter in conf file
		self.emit("done", self.folder.split("public/")[1] + "/" + zip);

	});

};

Packer.prototype.addAssets = function () {

	var self = this;

	// Feedback
	sys.puts(" > Packer: Copying assets.");

	// Code execution
	exec("cp -r " + self.input + "/assets " + self.folder, function (err) {
		if (err) { sys.puts(" > Packer " + err); }
		self.concludeTask();
	});

};

Packer.prototype.addRoot = function () {

	var self = this;

	// Feedback
	sys.puts(" > Packer: Copying root elements.");

	// Code execution
	exec("cd " + self.input + "/../ && cp *.html *.txt *.md " + self.folder, function (err) {

		if (err) { sys.puts(" > Packer " + err); }

		// Showroom file
		// TODO: use config object
		var f = fs.readFileSync(".." + (self.folder.split("~/development")[1]) + "/index.html").toString();

		// Replace routes
		// TODO: use config object
		f = f.replace("http://localhost:3000/css", "css/chico-min-" + self.version + ".css");
		f = f.replace("vendor/jquery-debug.js", "js/jquery.js");
		f = f.replace("http://localhost:3000/js", "js/chico-min-" + self.version + ".js");

		// TODO: use config object
		fs.writeFileSync(".." + (self.folder.split("~/development")[1]) + "/index.html", f);

		self.concludeTask();

	});

};

Packer.prototype.addExtras = function () {

	var self = this,

	// TODO: use conf
		bash = [
			"cd " + self.input + "/../",
			"cp vendor/jquery.js " + self.folder + "/js"
		];

	// TODO: make scalable to API doc + mesh + tester + more...
	// Add Chico Mesh
	if (self.params.extras === "mesh") {
		bash.push("cp src/css/mesh.css " + self.folder + "/css/chico-mesh.css");
	}

	// Feedback
	sys.puts(" > Packer: Adding the extras.");

	// Code execution
	exec(bash.join(" && "), function (err) {
		if (err) { sys.puts(" > Packer " + err); }
		self.concludeTask();
	});

};


Packer.prototype.pack = function () {

	var self = this,

	// Total amount of tasks to be executed
		total = 4,

	// Tasks concluded
		progress = 0;

	// Close a specific task and analize if all tasks are done
	self.concludeTask = function () {
		// Compress package when all tasks are ready
		if ((progress += 1) === total) {
			self.compress();
		}
	};

	// Create a folder name to save the generated files
	self.folder = self.output + "/temp" + ~~(Math.random() * 999999);

	// Feedback
	sys.puts(" > Packer: Creating the output folder (" + self.folder + ").");

	// Create basic structure of folders
	exec("mkdir " + self.folder + " && cd " + self.folder + " && mkdir js css", function (err) {

		if (err) { sys.puts(" > Packer " + err); }

		// Task 1: Instantiate the Joiner and send packages to create JS and CSS files
		self.addJoinedFiles();

		// Task 2: Add assets to assets folder (widgets images)
		self.addAssets();

		// Task 3: Add root files like readme, license and showroom files. Then, replace routes in showroom file.
		self.addRoot();

		// Task 4: Add extras like API documentation, Mesh files, Tester app, etc.
		self.addExtras();

	});
};

Packer.prototype.addJoinedFiles = function () {

	var self = this,

	// Construct joiner
		joiner = new Joiner(),

	// Package to be builded with Joiner
		packages = [],

	// Types of files (js, css)
		types = ["js", "css"],

	// Parameters from Download
		params = self.params,

	// Convert single "results" of compression level to array
		compress = (typeof params.compression === "string") ? [params.compression] : params.compression,

	// When all components are selected, don't specify a list of components.
	// When user select some components, get the list of them and delete spaces.
	// IMPORTANT: "totalWidgets" is a string value and "widgets.length" is a numeric value.
		components = (params.totalWidgets === params.widgets.length) ? "all" : params.widgets.join(",").split(" ").join(""),

	// Total of packages to build
		total = compress.length * types.length,

	// Files saved
		progress = 0;

	// Assemble the packages to Joiner
	// Loop from compression levels
	compress.forEach(function (compression) {
		// Loop from file types
		types.forEach(function (type) {
			// Add package
			packages.push({
				"name": "chico",
				"type": type,
				"min": (compression === "prod"),
				"components": components
			});
		});
	});

	// Listener that prints content of code
	joiner.on("joined", function (content, pack) {

		// Final name of file
		var file = pack.name + "-" + (pack.min ? "min-" : "") + self.version + "." + pack.type;

		// Feedback
		sys.puts(" > Packer: Creating the \"" + file + "\" file.");

		// Get inside the output folder and create the file to write
		exec("touch " + self.folder + "/" + pack.type + "/" + file, function (err) {

			if (err) { sys.puts(" > Packer " + err); }

			// Feedback
			sys.puts(" > Packer: Writting file " + file + ".");

			// Put content into created file
			// TODO: Use a parameter in conf file
			fs.writeFile(self.folder.split("chico.site/")[1] + "/" + pack.type + "/" + file, content, encoding = "utf8", function (err) {

				if (err) { sys.puts(" > Packer " + err); }

				// Feedback
				sys.puts(" > Packer: Done " + file);

				// Conclude task when all files are written
				if ((progress += 1) === total) {
					self.concludeTask();
				}

			});
		});
	});

	// Initialize joiner with only one package
	// TODO: input url depends who execute
	joiner.run({
		"input": self.input,
		"packages": packages
	});

};


Packer.prototype.run = function (params) {

	var self = this;

	self.params = params;

	// Read configuration object
	fs.readFile(__dirname + "/../conf.json", function (err, data) {

		if (err) { sys.puts(" > Packer " + err); }

		// Parse JSON data
		var conf = JSON.parse(data);

		// Grab all object properties on self context
		Object.keys(conf).forEach(function (e) {
			self[e] = conf[e];
		});

		// Feedback
		sys.puts(" > Packer: Initializing on v" + self.version + " of " + self.name + ".");

		self.input = self.params.input || conf.input;

		self.pack();

	});
};


// Exports
exports.Packer = Packer;