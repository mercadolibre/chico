// Include modules
var fs = require("fs"),
	sys = require("util"),
	express = require("express"),
	app = express.createServer(),
	port = process.argv[2] || 3000, // default port 3000
	Joiner = require("./joiner").Joiner;

// Assets getter
// http://localhost:3000/assets/xxxxx.*
app.get("/assets/:file", function (req, res) {

	// Read file content
	var content = fs.readFileSync("../../src/assets/" + req.params.file),

	// File extension
		ext = req.params.file.split(".").pop();
	
	// Return when file not exists
	if (!content) { return }
	
	res.header("Content-Type", {
		"png": "image/png",
		"gif": "image/gif",
		"jpg": "image/jpeg",
		"jpeg": "image/jpeg",
		"html": "text/html",
		"css": "text/css",
		"js": "text/javascript",
		"svg": "image/svg+xml",
		"svgz": "image/svg+xml",
		"eot": "application/vnd.ms-fontobject",
		"ttf": "application/x-font-ttf",
		"ttc": "application/x-font-ttf",
		"otf": "font/opentype",
		"woff": "application/x-font-woff",
		"undefined": "text/plain"
	}[ext]);

	res.header("Access-Control-Allow-Origin", "*");

	res.send(content);	
});

// JS and CSS getter
// http://localhost:3000/js
// http://localhost:3000/js/min
// http://localhost:3000/css
// http://localhost:3000/css/min
app.get("/:type/:min?", function (req, res) {

	// Construct joiner
	var joiner = new Joiner();

	// Listener that prints content of code
	joiner.on("joined", function (content) {
		// Content type header
		res.header("Content-Type", (req.params.type === "js" ? "text/javascript" : "text/css"));
		// Print data
		res.send(content);
	});

	// Initialize joiner with only one package
	joiner.run({
		"packages": [{
			"name": "chico",
			"type": req.params.type,
			"min": (req.params.min === "min")
		}]
	});

});


// Initialize application
app.listen(port);

// Feedback
console.log("Joiner listening on port %d...", app.address().port);
