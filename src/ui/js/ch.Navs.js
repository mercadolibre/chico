(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var $html = $('html');

	/**
	 * Navs is a representation of navs components.
	 * @constructor
	 * @memberOf ch
	 * @augments ch.Widget
	 * @param {Selector} $el Query Selector element.
	 * @param {Object} [options] Configuration options.
	 * @returns {Object}
	 * @see ch.Widget
	 * @see ch.Expando
	 * @see ch.Dropdown
	 */
	function Navs($el, options) {
		this.init($el, options);
		return this;
	}

	ch.util.inherits(Navs, ch.Widget);

	Navs.prototype.name = 'navs';

	Navs.prototype.constructor = Navs;

	/**
	 * Triggers the show method, returns the public scope to keep method chaining and emits an events with the same name.
	 * @name show
	 * @methodOf ch.Navs#
	 * @fires ch.Navs#show
	 * @returns {Object}
	 * @exampleDescription Shows the widget's contents.
	 * @example
	 * widget.show();
	 * @exampleDescription Suscribes to the show event.
	 * @example
	 * widget.on('show', fn);
	 */


	/**
	 * Hides component's content.
	 * @name hide
	 * @methodOf ch.Navs#
	 * @fires ch.Navs#hide
	 * @returns {Object}
	 * @exampleDescription Hides the widget's contents.
	 * @example
	 * widget.hide();
	 * @exampleDescription Suscribes to the hide event.
	 * @example
	 * widget.on('hide', fn);
	 */

	/**
	 * Create component's layout
	 * @protected
	 * @function
	 * @ignore
	 */

	/**
	 * Public Members
	 */

	/**
	 * Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	 * @name isActive
	 * @methodOf ch.Navs#
	 * @returns {boolean}
	 * @exampleDescription
	 * @example
	 * if (widget.isActive()) {
	 *     fn();
	 * }
	 */
	Navs.prototype.isActive = function () {
		return this.active;
	};

	ch.Navs = Navs;

}(this, this.jQuery, this.ch));