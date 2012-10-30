(function () {

	var util = ch.util,

		/**
		 * Global instantiation widget id.
		 * @private
		 * @type {Number}
		 */
		uid = 0;

	/**
	 * Base class for all widgets.
	 * @memberOf ch
	 * @constructor ch.Widget
	 * augments ch.EventEmitter
	 * @param {Selector} $el Query Selector element.
	 * @param {Object} [options] Configuration options.
	 * @property {Object} snippet XXXXX
	 * @property {Object} options The configuration properties.
	 * @property {Object} el DOM element
	 * @property {Selector} $el The cached jQuery/Zepto object.
	 * @property {Number} uid XXXXX
	 * @emits ready XXXXX
	 * @emits destroy XXXXX
	 * @returns {Object}
	 */
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

	/**
	 *
	 * @memberOf ch.Widget
	 */
	Widget.prototype = {};

	/**
	 * The name used to identify the class of this object into jQuery, Zepto or another library.
	 * @memberOf ch.Widget.prototype
	 */
	Widget.prototype.name = 'widget';

	/**
	 *
	 * @methodOf ch.Widget.prototype
	 */
	Widget.prototype.constructor = Widget;

	/**
	 *
	 * @methodOf ch.Widget.prototype
	 * @param {$Object} $el Selector
	 * @param {Object} [options] Configuration
	 */
	Widget.prototype.init = function ($el, options) {
		if (options === undefined) {
			if ($el === undefined) {
				this.options = util.clone(this.defaults);

			} else if ($el instanceof $) {
				this.$el = $el;
				this.el = $el[0];
				this.snippet = this.el.cloneNode();
				this.options = util.clone(this.defaults);

			} else if (typeof $el === 'object') {
				this.options = $.extend($el, this.defaults);
			}

		} else if ($el instanceof $ && typeof options === 'object') {
			this.$el = $el;
			this.el = $el[0];
			this.snippet = this.el.cloneNode();
			this.options = $.extend(options, this.defaults);

		} else {
			// TODO: Ver el cappítulo del libro de zakas Maintenible JavaScript para ver si nos conviene crear nuestro propios errores
			throw new window.Error('Expected 2 parameters or less');
		}

		this.uid = (uid += 1);

		// Gets or creates the klass's instances map
		instances[this.name] = instances[this.name] || {};
		instances[this.name][this.uid] = this;
	};

	/**
	 * Removes and destroys the widget rendered. Also, remove all UI events and data associated to the DOM element.
	 * @methodOf ch.Widget.prototype
	 */
	Widget.prototype.destroy = function () {
		//this.emits('destroy', this);

		this.$el.removeData(this.name);

		delete instances[this.name][this.uid];

	};

	//util.use(Widget, [ch.EventEmitter]);

	//this.emit('ready', this);

	ch.factory(Widget);

}());