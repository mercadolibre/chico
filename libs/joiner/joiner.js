/*
* Joiner
* Proccess the Chico UI source files and returns joined code.
*/

var sys = require("util"),
	fs = require("fs"),
	uglify = require("uglify-js"),
	cssmin = require("cssmin").cssmin,
	events = require("events"),
	exec = require("child_process").exec;

// Extend "Array" methods to delete duplicated values
Array.prototype.unique = function (a) {
	return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});


var Joiner = function () {

	var self = this;

	sys.puts("\n > Joiner: Ready to use.");

	return self;
};


// Event emitter
sys.inherits(Joiner, events.EventEmitter);


Joiner.prototype.run = function (o) {

	var self = this;

	// Read configuration object
	fs.readFile(__dirname + "/../conf.json", function (err, data) {

		if (err) { sys.puts(" > Joiner " + err); }

		// Parse JSON data of conf file
		var conf = JSON.parse(data);

		// Feedback
		sys.puts(" > Joiner: Joining from version " + conf.version);

		// Grab all object properties on self context
		// Use "o" data if exists or "conf" data
		Object.keys(conf).forEach(function (e) {
			self[e] = o[e] || conf[e];
		});

		// Create all package on list
		self.packages.forEach(function (e) {
			// TODO: this conditional fixes issue when app wanna call a "favicon.ico"
			if (e.type === "js" || e.type === "css") {
				self.collectFiles(e);
			}
		});
	});
};


Joiner.prototype.collectFiles = function (pack) {

	// Input folder
	pack.folder = this.input + "/" + pack.type;

	var self = this,

	// Get all components form folder or specific files by inheritance
		filesList = self.getFilesList(pack).split(","),

	// Amount of files to load
		total = filesList.length,

	// Total files saved asynchronously
		progress = 0,

	// Amount of files not founded on file harvest
		errors = 0,

	// Final result of source code
		filesContent = [];

	// Iterate each file to get its raw data
	filesList.forEach(function (file) {

		fs.readFile(pack.folder + "/" + file, encoding = "utf8", function (err, data) {

			if (!err) {
				// Add file content to final result
				filesContent.push(data);
			} else {
				// Increase amount of errors
				errors += 1;
			}

			// Execute this after last file
			if ((progress += 1) === total) {

				// Join all harved files
				self.joinFiles(pack, filesContent.join("\n\n"));

				// Errors feedback
				if (errors > 0) {
					sys.puts(" > Joiner: Amount of errors on file harvest: " + errors + " file/s not found.");
				}
			}
		});

	});
};


Joiner.prototype.getFilesList = function (pack) {

/*
*	All components on folder (Get the name of all files into pack folder)
*/
	if (!pack.hasOwnProperty("components") || pack.components === "all" || pack.components.length === 0) {
		return this.orderFiles(fs.readdirSync(pack.folder), pack.type);
	}

/*
*	Custom components, by inheritance
*/
	var self = this,

	// List of components
		list = [],

	// Read inheritance map
		map = JSON.parse(fs.readFileSync(__dirname + "/../cartographer/map.json")),
	
	// Climb throgh inheritance of components
		getDependencies = function (widget) {
			
			if (!widget) { return; }

			// Add widget to files list
			list.push(widget.name);
			
			// When widget got requirements, get them
			if (widget.hasOwnProperty("requires")) {
				widget.requires.forEach(function (e) {
					getDependencies(map[e]);
				});
			}
			
			// When widget needs an inheritance parent, get it
			if (widget.hasOwnProperty("augments")) {
				getDependencies(map[widget.augments]);
			}
		};
	
	// Add utils to beginning of files list on JS pack
	if (pack.type === "js") {
		for (var e in map) {
			if (map[e].hasOwnProperty("type") && map[e].type === "util") {
				list.push(e);
			}
		};
	}
	
	// Run each component dependencies grabbing
	pack.components.split(",").forEach(function (e) {
		getDependencies(map[e]);
	});
	
	// Delete duplicated widgets
	list = list.unique();

	// Set order to list of files
	return self.orderFiles(list, pack.type);
};


Joiner.prototype.orderFiles = function (list, type) {

	var self = this;

	// Delete ignored expressions
	list = list.join(",").replace((new RegExp("(.ds_store,)|(core.js,)|(core.css,)|(.js)|(.css)", "gi")), "").split(",");

	// Add core file
	// Note: When folder is read there is a core.
	// When files come from inheritance there isn't.
	list.push("core");

	// Filter ordered files matching with custom list of files
	// Add extension on all files of the list
	return self.filesOrder.split(",").filter(function (file1) {

		var match = false;

		// Walk through the custom list of files
		list.forEach(function (file2) {
			// File matching
			if (file1.toLowerCase() === file2.toLowerCase()) {
				return match = true;
			}
		});

		return match;
	
	}).join("." + type + ",") + "." + type;

};


Joiner.prototype.minify = function (pack, content) {

	switch (pack.type) {
	case "js":
		// Uglify
		var ast = uglify.parser.parse(content);
		ast = uglify.uglify.ast_mangle(ast);
		ast = uglify.uglify.ast_squeeze(ast);
		content = uglify.uglify.gen_code(ast);
		break;

	case "css":
		// CSS Min
		content = cssmin(content);
		break;
	}

	// Feedback
	sys.puts(" > Joiner: Compressed " + pack.type + " file to " + content.length + " KB.");

	return content;

};


Joiner.prototype.joinFiles = function (pack, content) {

	var self = this;

	// Get template according to file type
	var tpl = self.templates[pack.type][(pack.min ? "min" : "full")];

	// Replace tags
	tpl = tpl.replace("<version>", self.version);
	tpl = tpl.replace("<copyright>", (new Date()).getFullYear());

	// Optimize with uglify or cssmin if it's "min"
	if (pack.min) {
		content = self.minify(pack, content);
	}

	// Add source code to template
	content = tpl.replace("<code>", content);

	// Feedback
	sys.puts(" > Joiner: Joined " + pack.type.toUpperCase() + " package" + (pack.min ? " minified." : "."));
	
	// Send content
	self.emit("joined", content, pack);

};


// Exports
exports.Joiner = Joiner;