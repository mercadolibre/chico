#!/usr/bin/env node

var init = require("./Config").Config
	, Test = require("./Test").Test
	, events = require('events')
	, fs = require('fs')
	, INHERITANCE_MAP = require('./inheritanceMap.js').inheritance
	, Tester = require("./Tester.js").Tester
	;
	

var test = new Tester(process.argv);







