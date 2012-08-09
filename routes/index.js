/*
 * Module dependencies
 */

var app = module.parent.exports,
	Joiner = require('../libs/joiner').Joiner;

/*
 * Middlewares
 */

function isAnotherFile (req, res, next) {
	if (req.params.version === 'assets' || req.params.version === 'vendor') {
		next('route');
	} else {
		next();		
	}
};

function isView (req, res, next) {
	if (req.params.type === undefined) {
		res.render(req.params.version + '.html');
	} else {
		next();
	}
};

/*
 * Views
 */
app.get("/:version/:type?/:min?", isAnotherFile, isView, function (req, res, next) {
	var name = req.params.version + req.params.type.toUpperCase(),
		min = ((req.params.min) ? true : false),
		joiner = new Joiner();

	joiner.on("joined", function (content) {
		res.set('Content-Type', 'text/' + (req.params.type === "js" ? "javascript" : "css"));
		res.send(content);
	});

	joiner.run({"name": name, "min": min});
});

/*
 * Index
 */
app.get('/', function (req, res, next) {
	res.redirect('/ui')
});