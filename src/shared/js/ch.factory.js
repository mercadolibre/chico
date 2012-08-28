/**
* Creational patterns to create UI Components
* @private
* @static
* @name factory
* @param {object} [obj] Configuration Object
* @returns {object}
*/
(function () {
	function arguments (args) {
		args[0] = undefined
		selector = args[0];
	}

	function checkInstances() {}
	function plugin() {}

	function factory(klass, isPlugin) {
		klass.prototype.constructor = klass;
		klass.prototype.init = function (args) {
			arguments(args);


			options = options || default;
		};

		if (isPlugin) {
			plugin();
		}

		exports[klass] = klass;
	}

	exports.factory = factory;
}());


(function () {
	function EventEmitter() {
		var pepe = 'privado';
		this.on = function () {
			console.log(pepe + this.name);
		}
	};

	exports.EventEmitter = EventEmitter;
}());

(function () {

	function Widget(selector, options) {
		/*var instance = this.init(arguments);

		if (typeof instance === "object") {
			return instance;
		}*/
		this.init(arguments);

		//this.create();

		// Lo que expongo
		return {
			'name': this.name,
			'on': this.on,
			'uid': this.uid,
			'getId': this.getId
		};
	}

	Widget.prototype = {};
	Widget.prototype.name = 'widget';
	Widget.prototype.getId = function () {
		console.log(this.uid);
	};

	// -----------------------------
	//require(Widget, [ch.EventEmitter]);

	// Todo esto lo debería hacer el factory?
	Widget.prototype.init = function (arguments) {
		// ch.Widget(options);
		/*if (!arguments[0] instanceof $) {
			arguments[1] = arguments[0];
			arguments[0] = undefined;
		}*/

		// ch.Widget(selector);

		// ch.Widget();
	};

	Widget.prototype.create = function () {
	};

	//exports.factory(Widget, true);
}());

(function () {
	function A() {
		this.init();
	};

	inherits(A, ch.Widget);

	A.prototype.name = 'A';

	A.prototype.init = function () {
		this.uid = (i+=1);
	};

	exports.A = A;
}());