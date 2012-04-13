var assert = require("assert")
	, INHERITANCE_MAP = require('../cartographer/map.json');

var Config = (function(){
	var self = this;
		self.widgets = {};
		self.widgets.family = {	
			core: ["object"],
			object: ["uiobject"],
			families: ["floats","navs"],
			uiobject: ["calendar","carousel"],
			controllers: ["accordion","form","menu","tabNavigator"],
			controls: ["autoComplete","countdown","custom","email","datePicker","max","maxLength","min","minLength","number","price","required","string","url"],
			navs: ["dropdown","expando","tab","zoom"],
			floats: ["layer","modal","transition","tooltip"]
		}

		/*
		self.widgets.all = (function(){
			var arr = self.widgets.family;
			return Array.prototype.concat.call( {}, ["core"], arr.core, arr.object, arr.uiobject, arr.families, arr.controllers, arr.controls, arr.navs, arr.floats );
		}())
		*/

		self.version = "0.10.5";

		self.test = {};

		self.INHERITANCE_MAP = INHERITANCE_MAP;
		self.widgets.all = (function(){
			return Object.keys(self.INHERITANCE_MAP);
		}());

	return self;
}());


exports.Config = Config;