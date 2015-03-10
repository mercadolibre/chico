/*
 * Module dependencies
 */

var app = module.parent.exports,
    exec = require('child_process').exec;

/*
 * Middlewares
 */

function isAnotherFile (req, res, next) {
    var folder = req.params.version;
    if (folder === 'static' || folder === 'assets' || folder === 'vendor' || folder === 'test' || folder === 'libs') {
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
 * Index
 */
app.get('/', function (req, res, next) {
    res.redirect('/ui');
});

/*
 * Index Mobile
 */
app.get('/m', function (req, res, next) {
    res.redirect('/mobile');
});

/*
 * Files generator
 */
app.get('/:version/:type?/:file?', isAnotherFile, isView, function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    var min = ((req.query.min) ? '.min' : ''),
        filename = req.params.file || 'chico',
        path = '/dist/' + req.params.version + '/' + filename + min + '.' + req.params.type;

    if (filename !== 'chico') {
        path = '/src/' + req.params.version + '/' + req.params.type + '/' + filename + '.' + req.params.type;
    }

    exec('grunt dev --env=' + req.params.version, function (error, stdout, stderr) {
        res.sendfile(path, {'root': __dirname + '/../'});
    });
});