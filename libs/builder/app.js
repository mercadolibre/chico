// Include modules
var fs = require("fs"),
	express = require("express"),
	app = express.createServer(),
	Builder = require("./builder").Builder;

// JS and CSS getter
// http://localhost:3000/js
// http://localhost:3000/js/min
// http://localhost:3000/css
// http://localhost:3000/css/min
app.get("/:type/:min?", function (req, res) {

	// Construct builder
	var builder = new Builder("dev");

	// Listener that prints content of code
	builder.on("builded", function (content) {
		// Content type header
		res.header("Content-Type", (req.params.type === "js" ? "text/javascript" : "text/css"));
		// Print data
		res.send(content);
	});

	// Initialize builder with only one package
	builder.run([{
		"name": "chico",
		"type": req.params.type,
		"min": req.params.min
	}]);

});

// Assets getter
// http://localhost:3000/assets/xxxxx.png
/*app.get("/assets/:img", function (req, res) {
	
	// Read file content
	var content = fs.readFileSync("/assets/" + req.params.img);
	
	if (content) {
		res.header("Content-Type", "image/png");
		res.send(content);
	}
	
});*/

// Initialize application
app.listen(3000);

// Feedback
console.log("Builder listening on port %d...", app.address().port);