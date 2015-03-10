/**
 * Module dependencies.
 */
var express = require('express'),
	app = module.exports = express();

/**
 * App configuration.
 */
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.favicon());
app.use(app.router);
//app.use('/assets', express.static(__dirname + '/src/shared/assets'));
app.use('/vendor', express.static(__dirname + '/vendor'));
app.use('/assets/demo', express.static(__dirname + '/views/assets'));
app.use('/static', express.static(__dirname + '/views/static'));
app.use('/test', express.static(__dirname + '/tests'));
app.use('/libs', express.static(__dirname + '/libs'));
/**
 * Render HTML files
 */
app.set('views', __dirname + '/views');
app.set('view options', {'layout': false});
app.engine('html', require('ejs').renderFile);

/**
 * Routes
 */
require('./routes');

/**
 * Listen
 */
app.listen(3040);
console.log('Express app started on port 3040');