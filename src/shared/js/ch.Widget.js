/**
 * Creational patterns to create UI Components
 * @private
 * @static
 * @name factory
 * @param {object} [obj] Configuration Object
 * @returns {object}
 */
(function () {

	function Widget($el, options) {
		this.init($el, options);
/*
		// Init
		uid [Done]
		el [Done]
		$el [Done]
		options [Done]
		snippet (agregar al init como clon) [Done]

		// Prototype
		name [Done]
		defaults [Done]

		init() [Done]
		destroy() [Done]

		// Ability, es parte del expandible o como se llama que expone show y hide
		isActive()
		active

		// Ability
		enable()
		disable()
		toogleEnable()
		isEnabled()
		enabled

		// Abilities
		events

*/
		return this;
	}

	Widget.prototype = {};
	Widget.prototype.name = 'widget';
	Widget.prototype.constructor = Widget;

	Widget.prototype.init = function ($el, options) {
		if (options === undefined) {
			if ($el === undefined) {
				this.options = util.clone(this.defaults);

			} else if ($el instanceof $) {
				this.$el = $el;
				this.el = $el[0];
				this.snippet = this.el.cloneNode();
				this.options = util.clone(this.defaults);

			} else if (typeof $el === 'object') {
				this.options = util.extend($el, util.clone(this.defaults));
			}

		} else if ($el instanceof $ && typeof options === 'object') {
			this.$el = $el;
			this.el = $el[0];
			this.snippet = this.el.cloneNode();
			this.options = util.extend(options, util.clone(this.defaults));

		} else {
			// Ver el cappítulo del libro de zakas Maintenible JavaScript para ver si nos conviene crear nuestro propios errores
			throw new window.Error('Expected 2 parameters or less');
		}

		this.uid = (uid += 1);

		// Gets or creates the klass's instances map
		instances[this.name] = instances[this.name] || {};
		instances[this.name][this.uid] = this;
	}

	Widget.prototype.destroy = function () {
		this.$el.removeData(this.name);

		delete instances[this.name][this.uid];
	}

	//util.require(Widget, [ch.EventEmitter]);

	exports.Widget = Widget;
}());


/*(function () {
	function EventEmitter() {
		var pepe = 'privado';
		this.on = function () {
			console.log(pepe + this.name);
		}
	};

	exports.EventEmitter = EventEmitter;
}());*/
(function () {
	function A($el, options) {
		this.init($el, options);
	};

	util.inherits(A, exports.Widget);

	A.prototype.name = 'a';
	A.prototype.constructor = A;
	A.prototype.defaults = {};

	exports.factory(A);

}());