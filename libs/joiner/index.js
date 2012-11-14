/*!
 * Joiner
 * Proccess the source files and returns joined code.
 */
(function () {
	'use strict';

	var sys = require('util'),
		fs = require('fs'),
		uglify = require('uglify-js'),
		cssmin = require('cssmin').cssmin,
		events = require('events'),
		exec = require('child_process').exec;

	// Alias for 'sys.puts'
	function log(str) {
		sys.puts(' > Joiner: ' + str);
	}

	/**
	 * Contructor
	 */
	function Joiner() {

		log('Initializing.');

		// Grab the configuration file to local reference
		this.conf = JSON.parse(fs.readFileSync(__dirname + '/conf.json'));
		// Create an internal meta object
		this.metadata = {};

		log('Ready to use.');

		return this;
	}

	/**
	 * Event emitter
	 */
	sys.inherits(Joiner, events.EventEmitter);

	/**
	 * Finish
	 */
	Joiner.prototype.finish = function (content) {

		log('DONE');

		// Send advice to client
		this.emit('joined', {
			'raw': content,
			'type': this.metadata.type,
			'min': this.metadata.min
		});
	};

	/**
	 * Min
	 */
	Joiner.prototype.minify = function (content) {
		// Abstract Syntax Tree generated from JS code (only for uglify-js)
		var ast,
			// Final code
			minified;

		log('Minifying the raw data.');

		switch (this.metadata.type) {
		// Uglify
		case 'js':
			ast = uglify.parser.parse(content);
			ast = uglify.uglify.ast_mangle(ast);
			ast = uglify.uglify.ast_squeeze(ast);
			minified = uglify.uglify.gen_code(ast);
			break;
		// CSS Min
		case 'css':
			minified = cssmin(content);
			break;
		}

		return minified;
	};

	/**
	 * JoinFiles
	 * Pastes content into template specified on configuration file.
	 */
	Joiner.prototype.joinFiles = function (sources, template) {

		var self = this,
			// Grab locally the minificator boolean
			min = self.metadata.min,
			// Amount of references to read into template
			total = template.length,
			// Total files saved asynchronously
			progress = 0,
			// Final result of source code
			result = [],
			// String to use between the raw data of files
			separator = min ? '' : '\n\n';

		log('Joining data with reference to the specified template.');

		// Concatenate all template references into final results
		// TODO: Don't use eval if possible
		template.forEach(function (ref) {
			// Analize if the reference exists into sources map
			// When exists, take data from sources
			if (sources.hasOwnProperty(ref)) {
				// Join all raw data
				ref = sources[ref].join(separator);
			// When doesn't exist on sources map, use meta data and replace special tags
			} else {
				// Get template alocated into package object
				ref = eval('self.conf.' + ref);
				/**
				 * Replace special tags of metadata.
				 * @example
				 * This is the version <pkg.version>.
				 * @example
				 * Copyright (c) <js:(new Date().getFullYear())>
				 */
				if (ref) {
					ref = ref.replace(/(<)(js:)?(.*)(>)/gi, function (str, $1, $2, $3) {
						// If does exist the prefix 'js', then execute it without reference to
						// configuration object, else, add reference to self.conf object
						return eval($2 ? $3 : 'self.conf.' + $3);
					});
				}
			}
			// Add the data to the final collection
			result.push(ref);
			// Join all harved files after last file
			if ((progress += 1) === total) {
				// Concatenate data
				result = result.join(separator);
				// Minify code if it's necessary
				if (min) {
					result = self.minify(result);
				}
				// Send results
				self.finish(result);
			}
		});
	};

	/**
	 * Collect
	 * File collector for each collection into the package.
	 */
	Joiner.prototype.collect = function (files) {
		// Amount of files to load
		var total = files.length,
			// Total files saved asynchronously
			progress = 0,
			// Collection with each file data
			raw = [],
			// Local reference to readFile method
			read = fs.readFileSync;

		log('Getting raw data from files.');

		// Get the file extension to determine the type of package
		// It allows to minify specified extensions like js or css
		this.metadata.type = files[0].split('.').pop();
		// Iterate each file to get its raw data
		// Do it synchronously to respect the source order
		files.forEach(function (path) {
			// Add raw data to final collection
			raw.push(read(__dirname + '/' + path));
		});

		return raw;
	};

	/**
	 * Run
	 * Executes the file collector for all packages or minifier.
	 */
	Joiner.prototype.run = function (packname, min) {

		var self = this,
			// Get all the package data (sources and template)
			pack = this.conf.concat[packname],
			// Separate sources from package
			sources = {},
			// Separate template from package
			template = !min ? pack.template : self.conf.min[packname];

		log('Getting data from each source.');

		// Update if this package needs to be minified
		self.metadata.min = !!min;
		// Iterate the package keys to grab all the raw data of files of each source
		Object.keys(pack).forEach(function (src) {
			// Avoid to analize the template
			if (src === 'template') { return; }
			// Run the file collector for each source into package
			sources[src] = self.collect(pack[src]);
		});
		// Concatenate raw data into specified template (min or default)
		self.joinFiles(sources, template);
	};




	/*
	 * GetFilesList
	 * Uses the inheritance map to get the dependencies of requested files.
	 */
	/*Joiner.prototype.getFilesList = function (pack) {

		// All components on folder (Get the name of all files into pack folder)
		if (!pack.hasOwnProperty('components') || pack.components === 'all' || pack.components.length === 0) {
			return this.orderFiles(fs.readdirSync(pack.folder), pack.type);
		}

		// Custom components, by inheritance
		var self = this,

		// List of components
			list = [],

		// Read inheritance map
			map = JSON.parse(fs.readFileSync(__dirname + '/../cartographer/map.json')),

		// Climb throgh inheritance of components
			getDependencies = function (widget) {

				if (!widget) { return; }

				// Add widget to files list
				list.push(widget.name);

				// When widget got requirements, get them
				if (widget.hasOwnProperty('requires')) {
					widget.requires.forEach(function (e) {
						getDependencies(map[e]);
					});
				}

				// When widget needs an inheritance parent, get it
				if (widget.hasOwnProperty('augments')) {
					getDependencies(map[widget.augments]);
				}
			};

		// Add utils to beginning of files list on JS pack
		if (pack.type === 'js') {
			for (var e in map) {
				if (map[e].hasOwnProperty('type') && map[e].type === 'util') {
					list.push(e);
				}
			};
		}

		// Run each component dependencies grabbing
		pack.components.split(',').forEach(function (e) {
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
		list = list.join(',').replace((new RegExp('(.ds_store,)|(core.js,)|(core.css,)|(.js)|(.css)', 'gi')), '').split(',');

		// Add core file
		// Note: When folder is read there is a core.
		// When files come from inheritance there isn't.
		list.push('core');

		// Filter ordered files matching with custom list of files
		// Add extension on all files of the list
		return self.filesOrder.split(',').filter(function (file1) {

			var match = false;

			// Walk through the custom list of files
			list.forEach(function (file2) {
				// File matching
				if (file1.toLowerCase() === file2.toLowerCase()) {
					return match = true;
				}
			});

			return match;

		}).join('.' + type + ',') + '.' + type;
	};*/

	/**
	 * Exports
	 */
	exports.Joiner = Joiner;
}());