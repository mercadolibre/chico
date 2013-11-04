/*
 * Module dependencies
 */

var app = module.parent.exports,
    exec = require('child_process').exec,
    countries = require("../libs/countries").countries;

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
 * Country Service
 */
app.get('/countries', function (req, res, next) {
    var result = [],
        i = countries.length,
        response,
        contentType;

    while (i -= 1) {
        if (!countries[i].toLowerCase().search(req.query.q.toLowerCase())) {
            result.push(countries[i]);
        }
    }

    if (req.query.callback) {
        result.forEach(function(e,i){ result[i] = '"' + e + '"';});
        response = req.query.callback + '([' + result.toString() + ']);';
        contentType = 'application/json';
    } else {
        response = result;
        contentType = 'application/javascript';
    }

    res.header('Content-Type', contentType);
    res.send(response);
});

/*
 * Files generator
 */
app.get('/:version/:type?/:file?', isAnotherFile, isView, function (req, res, next) {
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