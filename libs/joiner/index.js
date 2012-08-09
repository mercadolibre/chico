/*!
 * Joiner
 * Proccess the source files and returns joined code.
 */
var sys = require("util"),
	fs = require("fs"),
	//uglify = require("uglify-js"),
	//cssmin = require("cssmin").cssmin,
	events = require("events"),
	exec = require("child_process").exec;

// Alias for "sys.puts"
function log(str) {
	"use strict";
	sys.puts(" > Joiner: " + str);
}

/*
 * Contructor
 */
function Joiner() {
	"use strict";

	log("Initializing.");

	// Grab the configuration file to local reference
	this.conf = JSON.parse(fs.readFileSync(__dirname + "/conf.json"));

	log("Ready to use.");

	return this;
}

/*
 * Event emitter
 */
sys.inherits(Joiner, events.EventEmitter);

/*
 * JoinFiles: Pastes content into template specified on configuration file.
 */
Joiner.prototype.joinFiles = function (pack, content) {
	"use strict";

	var self = this,
	// Amount of references to read into template
		total = pack.template.length,
	// Total files saved asynchronously
		progress = 0,
	// Final result of source code
		result = [],
	// String to use between files' raw data
		separator = "\n\n";

	log("Joining data with reference to the specified template.");

	pack.template.forEach(function (ref) {

		// Concatenate all template references into final results
		// TODO: Don't use eval if possible
		// Use meta data and replace special tags
		if (ref !== "src") {
			// Get template located into package object
			var tpl = eval("self.conf." + ref);
			// Replace special tags
			tpl = tpl.replace(/(<)(js:)?(.*)(>)/gi, function (str, $1, $2, $3) {
				// If does exist the prefix "js", then execute it
				// without reference to configuration object, else,
				// add reference to self.conf object
				return eval($2 ? $3 : "self.conf." + $3);
			});

			result.push(tpl);
		// Use concatenated raw
		} else {
			result.push(content.join(separator));
		}

		// Join all harved files after last file
		if ((progress += 1) === total) {

			log("DONE.");
			// Send advice to client
			self.emit("joined", result.join(separator));
		}
	});
};

/*
 * Run: Executes the file collector for all packages.
 */
Joiner.prototype.run = function (pack) {
	"use strict";

	var self = this,
	// Determines when use "concat" or "min" package
		type = pack.min ? "min" : "concat",
	// Redefine pack reference with respective package from configuration object
		pack = self.conf[type][pack.name],
	// Amount of files to load
		total = pack.src.length,
	// Total files saved asynchronously
		progress = 0,
	// Final result of source code
		result = [];

	log("Getting raw data from files.");

	// Iterate each file to get its raw data
	// Do it synchronously to respect the "src" order
	pack.src.forEach(function (path) {
		result.push(fs.readFileSync(__dirname + "/" + path));
	});

	self.joinFiles(pack, result);
};




/*
 * GetFilesList
 * Uses the inheritance map to get the dependencies of requested files.
 */
/*Joiner.prototype.getFilesList = function (pack) {

	// All components on folder (Get the name of all files into pack folder)
	if (!pack.hasOwnProperty("components") || pack.components === "all" || pack.components.length === 0) {
		return this.orderFiles(fs.readdirSync(pack.folder), pack.type);
	}

	// Custom components, by inheritance
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
};*/


/*
 * OrderFiles
 * Checks the order of files according to order specified on configuration file.
 */
/*Joiner.prototype.orderFiles = function (list, type) {

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
};*/


/*
 * Minify
 * Compress content.
 */
/*Joiner.prototype.minify = function (pack, content) {

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
	log("Compressed " + pack.type + " file to " + content.length + " KB.");

	return content;
};*/


// Exports
exports.Joiner = Joiner;