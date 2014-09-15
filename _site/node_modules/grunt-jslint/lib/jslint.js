/*jslint node:true*/

'use strict';

var path = require('path');

var vm = require('vm');

var fs = require('fs');

/*jslint nomen:true, stupid:true*/
var JSLINT_PATH = path.join(__dirname, '../jslint/jslint.js');

var ctx = vm.createContext();
vm.runInContext(fs.readFileSync(JSLINT_PATH, 'utf-8'), ctx);
var JSLINT = ctx.JSLINT;
/*jslint nomen:false, stupid:false*/

/**
 * Validate a file against JSLint
 *
 * @async
 * @param  {String}   file    The path of the file to validate
 * @param  {Object}   options Options, containing JSLint directives
 * @param  {Function} next    Callback: `function (err, errors)`
 */
function validate(file, options, next) {
  var fileName = path.basename(file),
    directives = options.directives || {};

  fs.readFile(file, 'utf-8', function (err, source) {

    if (err) {
      return next(err);
    }

    if (options.shebang) {
      /*jslint regexp:true*/
      source = source.replace(/^\#\!.*/, '');
    }

    JSLINT(source, directives);

    var data = JSLINT.data(),
      errors = JSLINT.errors,
      pending = errors.length,
      result = [];

    if (!directives.unused) {
      errors.concat(data.unused);
    }

    if (!pending) {
      return next(null, result);
    }

    errors.forEach(function (error) {
      if (error) {
        error.fileName = fileName;
        error.file = file;
        result.push(error);
      }

      pending -= 1;
      if (!pending) {
        return next(null, result);
      }
    });
  });
}

module.exports = validate;
