// Include modules
var fs = require("fs"),
	sys = require("util"),
	express = require("express"),
	app = express.createServer();


// jQuery getter
// http://localhost:9090/jquery
// http://localhost:9090/jquery/min
app.get("/jquery/:min?", function (req, res) {

	// File and Path variable for getting the correct version
	var file = (req.params.min === "min" ? "jquery.js" : "jquery-debug.js")
		, path = "/../../vendor/";

	// Read configuration object
	fs.readFile(__dirname + path + file, function (err, data) {

		if (err) { sys.puts(" > Tester " + err); }

		// Feedback
		sys.puts(" > Tester: Sending jQuery for " + (req.params.min ? "production" : "debug" ) );

		// Print data
		res.send(data);

	});

	// Content type header
	res.header("Content-Type", "text/javascript");

});

// Components route
// http://localhost:9090/modal
// http://localhost:9090/dropdown
app.get("/:component?", function (req, res) {

	// File and Path variable for getting the correct version
	var q = req.params.component,
		file = "/tests/" + q + ".html";


	// Read configuration object
	fs.readFile(__dirname + file, function (err, data) {

		if (err) {
			// Feedback
			// ToDo: Template
			res.send("<h1>ERROR 404 \"" + q + "\" Don't exist!</h1>"); 
			sys.puts(" > Tester " + err); 
		} else {
			// Feedback
			sys.puts(" > Tester: Sending jQuery for " + (req.params.min ? "production" : "debug" ) );

			// Print data
			res.send(data);
		}

	});

	// Content type header
	res.header("Content-Type", "text/html");

});

// Initialize application
app.listen(9090);

// Feedback
console.log("Tester listening on port %d...", app.address().port);