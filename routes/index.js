/*
 * Module dependencies
 */

var app = module.parent.exports,
    exec = require('child_process').exec,
    Joiner = require('../libs/joiner').Joiner;

/*
 * Middlewares
 */

function isAnotherFile (req, res, next) {
    var folder = req.params.version;
    if (folder === 'assets' || folder === 'vendor' || folder === 'test' || folder === 'libs') {
        next('route');
    } else {
        next();
    }
};

function isView (req, res, next) {
    if (req.params.type === undefined) {
        exec('grunt dev --target=' + req.params.version, function (error, stdout, stderr) {
            res.render(req.params.version + '.html');
        });

    } else {
        next();
    }
};

/*
 * Views
 */
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

app.get('/:version/:type?/:file?', isAnotherFile, isView, function (req, res, next) {
    var min = ((req.query.min) ? '.min' : ''),
        filename = req.params.file || 'chico',
        path = '/temp/' + req.params.version + '/' + filename + min + '.' + req.params.type;

    if (filename !== 'chico') {
        path = '/src/' + req.params.version + '/' + req.params.type + '/ch.' + filename + '.' + req.params.type;
    }

    res.sendfile(path, {'root': __dirname + '/../'});
});