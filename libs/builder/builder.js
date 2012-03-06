/*
* Builder
* Proccess the Chico UI source files and returns a packed version of the library.
* Output (PROD MODE): tempXXXXX/file-X.X.X.zip
* Output (DEV MODE): Source code.
*/

var sys = require("util"),
	fs = require("fs"),
	uglify = require("uglify-js"),
	cssmin = require("cssmin").cssmin,
	events = require("events"),
	exec = require("child_process").exec;


var Builder = function (environment) {

	var self = this;

	self.environment = environment || process.argv[2] || "prod";

	sys.puts(" ____        _ _     _");
	sys.puts("|  _ \\      (_) |   | |");
	sys.puts("| |_) |_   _ _| | __| | ___ _ __");
	sys.puts("|  _ <| | | | | |/ _` |/ _ \\ '__|");
	sys.puts("| |_) | |_| | | | (_| |  __/ |");
	sys.puts("|____/ \\__,_|_|_|\\__,_|\\___|_| " + self.environment.toUpperCase() + " MODE\n");

	return self;
};

// Event emitter
sys.inherits(Builder, events.EventEmitter);


Builder.prototype.saveFile = function (filename, content) {

	var self = this,

	// Full URL of file to be written
		file = self.foldername + "/" + filename;

	// Feedback
	sys.puts(" > Creating the \"" + file + "\" file...");

	// Get inside the output folder and create the file to write
	exec("touch " + filename, function (err) {

		if (err) { sys.puts(err); }

		// Feedback
		sys.puts(" > Writting " + content.length + " KB in " + filename + "...");

		// Put content into created  file
		fs.writeFile(filename, content, encoding = "utf8", function (err) {

			if (err) { sys.puts(err); }

			// Feedback
			sys.puts(" > Done: " + filename);
			
			self.emit("builded", content);

		});
	});
};


Builder.prototype.minify = function (pack, content) {

	// File size until compress
	var size = content.length;

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
	sys.puts(" > Compressed " + pack.type + " file from " + size + " KB to " + content.length + " KB.");

	return content;

};


Builder.prototype.joinFiles = function (pack, content) {

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

	// PROD: Save file, DEV: Print content
	if (self.environment === "prod") {
		self.saveFile(pack.filename, content);
	} else {
		sys.puts(" > Builded: " + pack.type.toUpperCase() + " package" + (pack.min ? " minified." : "."));
		self.emit("builded", content);
	}

};


Builder.prototype.getFilesList = function (pack) {
	
	// Get the name of all files into pack folder
	if (!pack.hasOwnProperty("components")) {
		return fs.readdirSync(pack.folder).join(",");
	}

	var files = [];

	// Read inheritance map
	fs.readFile(__dirname + "../cartographer/map.json", function (err, data) {

		if (err) { sys.puts(err); }

		// Parse JSON data
		var map = JSON.parse(data),

			getDependencies = function (file) {

				files.push(file);

				if (map[file].hasOwnProperty(augments)) {
					getDependencies(map[file].augments);
				}

			};

		// Feedback
		sys.puts(" > Getting entire list of files...");

		pack.components.split(",").forEach(function (e) {

			getDependencies(e);

		});
	});
};

Builder.prototype.collectFiles = function (pack) {

	// Input folder
	pack.folder = this.input + "/" + pack.type;

	// Final name of file
	pack.filename = pack.name + "-" + (pack.min ? "min-" : "") + this.version + "." + pack.type;

	var self = this,

	// Get all components form folder or specific files
		filesList = self.getFilesList(pack),

	// Blacklist of files
		blacklist = new RegExp("(.ds_store,)|(core.js,)|(core.css,)|(mesh.css,)", "gi"),

	// Final result of source code, including "core" file first
		content = fs.readFileSync(pack.folder + "/core." + pack.type, encoding = "utf8").toString(),

	// Total files saved asynchronously
		saved = 0;

	// Filter blacklist files
	filesList = filesList.replace(blacklist, "");

	// Convert string to array and revert to iteration from last to first
	filesList = filesList.split(",").reverse();

	// Grab the length of array
	var i = filesList.length,

	// Amount of files to load
		target = i - 1;

	// Iterate each file to get its raw data
	while (i -= 1) {
		fs.readFile(pack.folder + "/" + filesList[i], encoding = "utf8", function (err, data) {

			if (err) { sys.puts(err); }

			// Add file content to final result
			content += "\n\n" + data;

			// Increase saved items amount
			saved += 1;

			// Execute this after last file
			if (saved === target) {
				self.joinFiles(pack, content);
			}
		});
	};
};


Builder.prototype.createTempFolder = function () {

	var self = this;

	// Create a folder name to save the generated files (only in production)
	self.foldername = self.output + "/temp" + ~~(Math.random() * 99999);

	// Feedback
	sys.puts(" > Creating the \"" + self.foldername + "\" folder...");

	// Create the folder to save the generated files
	exec("cd " + self.output + " && mkdir " + self.foldername);

};


Builder.prototype.run = function (packages) {

	var self = this;

	// Read configuration object
	fs.readFile(__dirname + "/conf.json", function (err, data) {

		if (err) { sys.puts(err); }

		// Parse JSON data
		var conf = JSON.parse(data);

		// Feedback
		sys.puts(" > Building version " + conf.version + " of " + conf.name + ".");

		// Grab all object properties on self context
		Object.keys(conf).forEach(function (e) {
			self[e] = conf[e];
		});

		// Use packages parameters instead the default packages, if exists
		if (packages) {
			self.packages = packages;
		}

		if (self.environment === "prod") {
			self.createTempFolder();
		}

		// Create all package on list
		self.packages.forEach(function (e) {
			self.collectFiles(e);
		});
	});
};


// Exports
exports.Builder = Builder;