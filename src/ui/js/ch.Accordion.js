(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	/**
	 * Accordion lets you organize the content like folds.
	 * @memberOf
	 * @constructor
	 * @interface
	 * @augments ch.Menu
	 * @requires ch.Expandable
	 * @see ch.Widget
	 * @see ch.Menu
	 * @see ch.Expandable
	 * @param {Object} [options] Object with configuration properties.
	 * @param {Number} [options.selected] Selects a child that will be open when component was loaded.
	 * @param {Boolean} [options.fx] Enable or disable UI effects. By default, the effects are disable.
	 * @returns itself
	 * @exampleDescription Create a new Accordion.
	 * @example
	 * var widget = $('.example').accordion();
	 * @exampleDescription Create a new Accordion with configuration.
	 * @example
	 * var widget = $('.example').accordion({
	 *     'selected': 2,
	 *     'fx': true
	 * });
	 */
	function Accordion($el, options) {
		options = options || {};
		options.accordion = true;
		options.fx = (ch.util.hasOwn(options, 'fx')) ? options.fx : true;
		options.classes = options.classes || 'ch-accordion';

		return $el.menu(options);
	}

	Accordion.prototype.name = 'accordion';
	Accordion.prototype.constructor = Accordion;
	Accordion.prototype.preset = 'Menu';

	ch.factory(Accordion);

}(this, this.jQuery, this.ch));