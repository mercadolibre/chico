// Include modules
var fs = require("fs"),
	express = require("express"),
	app = express.createServer(),
	Joiner = require("./joiner").Joiner;

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
console.log("Joiner listening on port %d...", app.address().port);