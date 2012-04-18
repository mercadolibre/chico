/*
* Cartographer
* Proccess the source files and returns a JSON Object with a Inheritance Map.
*/

var sys = require("util"),
	fs = require("fs"),
	child = require("child_process"),
	exec  = child.exec,
	map = {};

var trim = function (str) {
	return str.replace(/^\s+|\s+$/g, "");
}

sys.puts(" > Cartographer: Ready to use.");

// Create a temporal map of all classes
exec("cat ../../src/js/* > ../cartographer/temp_map.js", function (err) {
	
	if (err) { return sys.puts(err); }

	// Read temporal map of classes
	fs.readFile("../cartographer/temp_map.js", function (err, data) { 
		
		sys.puts(" > Cartographer: Processing classes.");
		
		var raw = data.toString().split("/**").join("><><").split(" */").join("><><").split("><><"),
			tmp = [],
			i = 0,
			t = raw.length,
			tags = 0;
		
		for (i; i < t; i += 1) {
			if (raw[i].indexOf("@class") > -1 || raw[i].indexOf("@interface") > -1) {
				var chunk = raw[i].split("\n").join("").split(" * ");
				tmp.push(chunk);
			}
		}
		
		i = 0;
		t = tmp.length;

		// output object	
		var m;
		
		for (i; i < t; i += 1) {
			// This chunk should be all the tags from one class
			var chunk = tmp[i],
				tt = chunk.length,
				className = "",
				classDesc = "";
			
			tags += tt;
			
			var chunk = tmp[i].join(" "),
			
			// @class
				className = chunk.match(/@class(\s+)(\w)+/g);
			
			if (className) {
				className = className.toString().split("@class ").join("");
				classType = "class";
			}

			// description
			var classDesc = trim(chunk.split("@")[0]);

			// Create Map
			m = map[className] = {
				"name": className,
				"description": classDesc,
				"type": classType
			};

			// @interface
			var interface = chunk.match(/@interface/g);

			if (interface) {
				//interface = interface.toString().split("@interface ").join("");
				//className = interface;
				//classType = "interface";
				m["interface"] = true;
			}

			// @standalone
			var standalone = chunk.match(/@standalone/g);

			if (standalone) {
				m["standalone"] = true;
			}

			// @aguments
			var augments = chunk.match(/@augments(\s+)(ch.)(\w)+/g);

			if (augments) {
				m["augments"] = trim(augments.toString().split("@augments ch.").join(""));
			}

			// @requires
			var requires = chunk.match(/@requires(\s+)(ch.)(\w)+/g);

			if (requires) {
				
				map[className].requires = map[className].requires || [];

				requires.forEach(function (e) {
					m["requires"].push(trim(e.replace("@requires ch.", "")));
				});
			}

			// @abstract @util			
			if (/@abstract/.test(chunk)) {			   
				m["type"] = "abstract";

				if (!augments) {
					m["type"] = "util";
				}
			}
		}
			 
		sys.puts(" > Cartographer: " + t + " classes processed.");
		sys.puts(" > Cartographer: " + tags + " tags processed.");
		sys.puts(" > Cartographer: Updating map file.");

		// Write the map to a file
		fs.writeFile("../cartographer/map.json", JSON.stringify(map), encoding = "utf8", function (err) {
			
			if (err) { return sys.puts(" > Cartographer: " + err); }
			
			sys.puts(" > Cartographer: Done.")
		});

		// Erase temporal map of classes
		fs.unlink("../cartographer/temp_map.js", function () {
			sys.puts(" > Cartographer: Deleting temporary files.")
		});
	});
});