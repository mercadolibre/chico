/**
* Creational patterns to create UI Components
* @private
* @static
* @name factory
* @param {object} [obj] Configuration Object
* @returns {object}
*/
(function () {
	function checkInstance() {
		/*var instance;

		instances[this.name] = instances[this.name] || [];

		if (typeof this.$el !== 'undefined') {
			$.each(instances[this.name], function (i, el) {
				if (el.el === this.el) {
					instance = el;
					return false;
				}
			});
		}

		if (typeof instance === 'object') {
			return instance;
		}

		instances[this.name].push(this);
		*/
	}

	function init($el, options) {
		if (typeof options === 'undefined') {
			if (typeof $el === 'undefined') {
				this.options = util.clone(this.defaults);

			} else if ($el instanceof $) {
				this.$el = $el;
				this.el = $el[0];
				this.options = util.clone(this.defaults);

			} else if (typeof $el === 'object') {
				this.options = util.extend($el, util.clone(this.defaults));
			}

		} else if ($el instanceof $ && typeof options === 'object') {
			this.$el = $el;
			this.el = $el[0];
			this.options = util.extend(options, util.clone(this.defaults));

		} else {
			throw new window.Error('Expected 2 parameters or less');
		}

		//return checkInstance.call(this);
	}

	function toCapitalCase(name) {
		return name[0].toUpperCase() + name.substr(1);
	}

	function createPlugin(klass) {
		var name = klass.prototype.name;

		/*$.fn[name] = function (options) {
			$.each(this, function (i, el) {
				widgets.push(new ch[toCapitalCase(name)]($(el), options));
			});

			//return ((widgets.length > 1) ? widgets : widgets[0]);
		};*/

		$[name] = function ($el, options) {
			var widget = new klass($el, options);
			instances[this.name].push(widget);

			return widget;
		};

		$.fn.[name] = function (options) {
			var widgets = [];
			// ACA esta toda la papa: http://docs.jquery.com/Plugins/Authoring
			// Aca tenemos ordenar los parametros del plugin para meterlos dentro un ub objecto.
			// Si es un string, un numbero, una funcion, o ambos (num, str), (str), (fn)

			// El el siempre viene porque esto se utiliza con selector SIEMPRE!

			// Here!

			$.each(this, function (i, el) {

				widgets.push(new klass($(el), options));
			})
		};
	}

	function factory(klass) {
		klass.prototype.constructor = klass;
		klass.prototype.init = init;

		// tiene que crear $.widget y $('').widget();
		createPlugin(klass);

		exports[klass.name] = klass;
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

	function Widget(el, options) {
		// aca adentro se tienen que definir los this.el y this.options y tiene que chequear si exisite la instancia
		// en el factory tiene que preparar los parametros que recibe el plugin de jquery y transformarlo en (el, options)
		/*var instance = this.init(el, options);
		if (typeof instance === 'object') {
			console.log('Ya existe!');
			return instance;
		}*/

		this.init(el, options)

		//this.create();

		// Lo que expongo
		/*return {
			'name': this.name,
			'on': this.on,
			'uid': this.uid,
			'getId': this.getId
		};*/

		return this;
	}

	Widget.prototype = {};
	Widget.prototype.name = 'widget';
	Widget.prototype.getId = function () {
		console.log(this.uid);
	};

	Widget.prototype.defaults = {
		'open': false
	};

	// -----------------------------
	//util.require(Widget, [ch.EventEmitter]);

	/*Widget.prototype.init = function ($el, options) {
		if (typeof options === 'undefined') {
			if (typeof $el === 'undefined') {
				this.options = util.clone(this.defaults);

			} else if ($el instanceof $) {
				this.$el = $el;
				this.el = $el[0];
				this.options = util.clone(this.defaults);

			} else if (typeof $el === 'object') {
				this.options = util.extend($el, util.clone(this.defaults));
			}

		} else if ($el instanceof $ && typeof options === 'object') {
			this.$el = $el;
			this.el = $el[0];
			this.options = util.extend(options, util.clone(this.defaults));

		} else {
			throw new window.Error('Expected 2 parameters or less');
		}

		return this.checkInstance();
	};*/

	exports.factory(Widget);
}());

/*(function () {
	function A() {
		this.init();
	};

	inherits(A, ch.Widget);

	A.prototype.name = 'A';

	A.prototype.init = function () {
		this.uid = (i+=1);
	};

	exports.A = A;
}());*/



/*
if (arguments.length === 0) {
	this.options = ch.util.clone(this.defaults);

} else {

	switch (typeof options) {
	case 'object':
		this.options = ch.util.extend(options, ch.util.clone(this.defaults));
		break;

	case 'string':
		this.options = ch.util.extend({'message': options}, ch.util.clone(this.defaults));
		break;

	case 'undefined':
		this.options = ch.util.clone(this.defaults);
		break;
	}

	switch (typeof el) {
	case 'object':
		if (el instanceof $) {
			this.el = el;
		} else {
			this.options = ch.util.extend(el, ch.util.clone(this.defaults));
		}
		break;

	case 'string':
		this.options = ch.util.extend({'message': el}, ch.util.clone(this.defaults));
		break;

	case 'number':
		this.options = ch.util.extend({'num': el}, ch.util.clone(this.defaults));
		break;

	case 'function':
		this.options = ch.util.extend({'fn': el}, ch.util.clone(this.defaults));
		break;
	}
}

*/