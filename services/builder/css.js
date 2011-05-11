var puts = require('sys').puts,
    fs = require('fs'),
    cssmin = require('../lib/cssmin').cssmin;

var css = fs.readFileSync("../../src/css/core.css", encoding='utf8');

var min = cssmin(css);

puts(min);