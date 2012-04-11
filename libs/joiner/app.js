// Include modules
var fs = require("fs"),
	sys = require("util"),
	express = require("express"),
	app = express.createServer(),
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
		"undefined": "text/plain"
	}[ext]);

	res.send(content);	
});


// jQuery getter
// http://localhost:3000/jquery
app.get("/jquery/:min?", function (req, res) {

	// File and Path variable for getting the correct version
	var file = (req.params.min === "min" ? "jquery.js" : "jquery-debug.js")
		, path = "/../../vendor/";

	// Read configuration object
	fs.readFile(__dirname + path + file, function (err, data) {

		if (err) { sys.puts(" > Joiner " + err); }

		// Feedback
		sys.puts(" > Joiner: Sending jQuery for " + (req.params.min ? "production" : "debug" ) );

		// Print data
		res.send(data);

	});

	// Content type header
	res.header("Content-Type", "text/javascript");

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
app.listen(3000);

// Feedback
console.log("Joiner listening on port %d...", app.address().port);