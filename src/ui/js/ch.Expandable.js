(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var $html = $('html');

	/**
	 * Expandable lets you show or hide the container. Expandable needs a pair: the title and the container related to that title.
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
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @type {Object}
		 */
		var that = this;

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
		window.setTimeout(function () { that.emit('ready'); }, 50);
	}

	/**
	 * Inheritance
	 */
	ch.util.inherits(Expandable, ch.Widget);

	Expandable.prototype.name = 'expandable';

	Expandable.prototype.constructor = Expandable;

	Expandable.prototype.defaults = {
		'icon': true,
		'open': false,
		'fx': false
	};

	Expandable.prototype.init = function ($el, options) {
		this.uber.init.call(this, $el, options);
		this.require('Collapsible', 'Content');

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
				'aria-expanded': that.options.open,
				'aria-controls': 'ch-expandable-' + that.uid
			},

			/**
			 * Map that contains the ARIA attributes for the container element
			 * @private
			 * @type {Object}
			 */
			containerAttr = {
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
		 that.active = this.options.open;

		/**
		 * The component's trigger.
		 * @protected
		 * @type {Selector}
		 * @ignore
		 */
		that.$trigger = that.$el.children(':first-child');

		/**
		 * The component's container.
		 * @protected
		 * @type {Selector}
		 * @ignore
		 */
		that.$container = that.$el.children(':last-child').wrapInner('<div class="ch-expandable-content">');

		/**
		 * The component's content.
		 * @protected
		 * @type {Selector}
		 * @ignore
		 */
		that.$content = that.$container.children(':last-child');

		/**
		 * Default behavior
		 */
		that.$el.addClass('ch-expandable');

		that.$trigger
			.attr(triggerAttr)
			.addClass('ch-expandable-trigger')
			.on('click.expandable', function (event) {
				ch.util.prevent(event);
				that.show();
			})
			.children()
				.attr('role', 'presentation');

		that.$container
			.attr(containerAttr)
			.addClass('ch-expandable-container ch-hide');

		that.content.onmessage = function (data) {
			that.$content.html(data);
		};

		// Icon configuration

		if (this.options.icon) {
			if ($html.hasClass('lt-ie8')) {
				$('<span class="ch-expandable-ico">Drop</span>').appendTo(this.$trigger);

			} else {
				this.$trigger.addClass('ch-expandable-ico');
			}
		}

		if (this.options.open) {
			this.show();
		}

		ch.util.avoidTextSelection(that.$trigger);

	};


	Expandable.prototype.show = function () {
		if (this.active) {
			return this.hide();
		}

		this.collapsible.show();

		return this;
	};

	Expandable.prototype.hide = function () {
		if (!this.active) {
			return;
		}

		this.collapsible.hide();

		return this;
	};


	/**
	 * Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	 * @name isActive
	 * @methodOf ch.Expandable#isActive
	 * @returns {boolean}
	 * @exampleDescription
	 * @example
	 * if (widget.isActive()) {
	 *     fn();
	 * }
	 */
	Expandable.prototype.isActive = function () {
		return this.active;
	};

	ch.factory(Expandable);

	$.fn.expando = $.fn.expandable;

}(this, this.jQuery, this.ch));