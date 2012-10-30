(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	/**
	 * Expandable lets you show or hide the content. Expandable needs a pair: the title and the content related to that title.
	 * @constructor
	 * @memberOf ch
	 * @augments ch.Navs
	 * @param {Object} [options] Object with configuration properties.
	 * @param {Boolean} [options.open] Shows the expandable open when component was loaded. By default, the value is false.
	 * @param {Boolean} [options.fx] Enable or disable UI effects. By default, the effects are disable.
	 * @returns {Object}
	 * @exampleDescription Create a new expandable without configuration.
	 * @example
	 * var widget = $('.example').expandable();
	 * @exampleDescription Create a new expandable with configuration.
	 * @example
	 * var widget = $('.example').expandable({
	 *     'open': true,
	 *     'fx': true
	 * });
	 */
	function Expandable($el, options) {

		this.init($el, options);


		/**
		 * Private Members
		 */

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @type {Object}
		 */
		var that = this,

			/**
			 * Map that contains the ARIA attributes for the trigger element
			 * @private
			 * @type {Object}
			 */
			triggerAttr = {
				'aria-expanded': this.options.open,
				'aria-controls': 'ch-expandable-' + this.uid
			},

			/**
			 * Map that contains the ARIA attributes for the content element
			 * @private
			 * @type {Object}
			 */
			contentAttr = {
				'id': triggerAttr['aria-controls'],
				'aria-hidden': !triggerAttr['aria-expanded']
			};

		/**
		 * Protected Members
		 */

		/**
		 * Status of component
		 * @protected
		 * @type {Boolean}
		 * @ignore
		 */
		this.active = false;

		/**
		 * The component's trigger.
		 * @protected
		 * @type {Selector}
		 * @ignore
		 */
		this.$trigger = this.$el.children().eq(0).attr(triggerAttr);

		/**
		 * The component's content.
		 * @protected
		 * @type {Selector}
		 * @ignore
		 */
		this.$content = this.$el.children(':last-child').attr(contentAttr);

		/**
		 *  Default behaivor
		 */
		this.configBehavior();
		this.$el.addClass('ch-' + this.name);
		this.$trigger.children().attr('role', 'presentation');
		ch.util.avoidTextSelection(this.$trigger);

		/**
		 * Triggers when the component is ready to use (Since 0.8.0).
		 * @fires ch.Expandable#ready
		 * @since 0.8.0
		 * @exampleDescription Following the first example, using <code>widget</code> as expandable's instance controller:
		 * @example
		 * widget.on('ready',function () {
		 *	this.show();
		 * });
		 */
		window.setTimeout(function () { that.trigger('ready'); }, 50);

		return this;

	}

	/**
	 *	Inheritance
	 */
	ch.util.inherits(Expandable, ch.Navs);

	Expandable.prototype.name = 'expandable';

	Expandable.prototype.constructor = Expandable;

	Expandable.prototype.defaults = {
		'icon': true,
		'open': false,
		'fx': false
	};

	Expandable.prototype.show = function () {
		this.$trigger.attr('aria-expanded', 'true');
		this.$content.attr('aria-hidden', 'false');

		// Call the superClass method
		this.uber.show.call(this);

		return this;
	};

	Expandable.prototype.hide = function () {
		this.$trigger.attr('aria-expanded', 'false');
		this.$content.attr('aria-hidden', 'true');

		// Call the superClass method
		this.uber.hide.call(this);

		return this;
	};


	ch.factory(Expandable);

	$.fn.expando = $.fn.expandable;

}(this, this.jQuery, this.ch));