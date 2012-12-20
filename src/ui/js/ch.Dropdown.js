/**
 * Dropdown shows a list of options for navigation.
 * @name Dropdown
 * @class Dropdown
 * @augments ch.Navs
 * @requires ch.Positioner
 * @see ch.Navs
 * @see ch.Positioner
 * @see ch.Expando
 * @see ch.TabNavigator
 * @memberOf ch
 * @param {Object} [options] Object with configuration properties.
 * @param {Boolean} [options.open] Shows the dropdown open when component was loaded. By default, the value is false.
 * @param {Boolean} [options.reposition]
 * @param {String} [options.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
 * @param {Boolean} [options.fx] Enable or disable UI effects. By default, the effects are disable.
 * @returns itself
 * @factorized
 * @exampleDescription Create a new dropdown without configuration.
 * @example
 * var widget = $('.example').dropdown();
 * @exampleDescription Create a new dropdown with configuration.
 * @example
 * var widget = $('.example').dropdown({
 *     'open': true,
 *     'icon': false,
 *     'points': 'lt lt',
 *     'fx': true
 * });
 */
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Dropdown($el, options) {

		this.init($el, options);

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @type {Object}
		 */
		var that = this;


		/**
		 * Triggers when the component is ready to use (Since 0.8.0).
		 * @fires ch.Dropdown#ready
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
	 * Private
	 */
	var $document = $(window.document),
		$html = $('html'),

		/**
		 * Inheritance
		 */
		parent = ch.util.inherits(Dropdown, ch.Widget);

	/**
	 * Prototype
	 */
	Dropdown.prototype.name = 'dropdown';

	Dropdown.prototype.constructor = Dropdown;

	Dropdown.prototype.defaults = {
		'open': false,
		'fx': false,
		'side': 'bottom',
		'aligned': 'left',
		'offsetY': '-1',
		'closable': true
	};

	Dropdown.prototype.init = function ($el, options) {
		parent.init.call(this, $el, options);

		this.require('Collapsible', 'Closable');

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
				'aria-controls': 'ch-dropdown-' + that.uid
			},

			/**
			 * Map that contains the ARIA attributes for the container element
			 * @private
			 * @type {Object}
			 */
			containerAttr = {
				'role': 'menu',
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
		that.$container = that.$el.children(':last-child');

		/**
		 * Dropdown options.
		 * @protected
		 * @type {Selector}
		 */
		that.$options = this.$container.find('a');

		/**
		 * Default behavior
		 */

		that.$el.addClass('ch-dropdown');

		if (!that.$el.hasClass('ch-dropdown-skin')) {
			that.$trigger.addClass('ch-btn-skin ch-btn-small');
		}

		that.$trigger
			.attr(triggerAttr)
			.addClass('ch-dropdown-trigger')
			.on('click.dropdown', function (event) {
				ch.util.prevent(event);
				that.show();
			});

		that.$container
			.attr(containerAttr)
			.addClass('ch-dropdown-container ch-hide')
			.on('click.dropdown', function (event) {
				if ((event.target || event.srcElement).tagName === 'A') {
					that.hide();
				}
			});

		that.$options.attr('role', 'menuitem');

		// Icon configuration
		if ($html.hasClass('lt-ie8')) {
			$('<span class="ch-dropdown-ico">Drop</span>').appendTo(this.$trigger);

		} else {
			this.$trigger.addClass('ch-dropdown-ico');
		}

		that.closable();

		ch.util.avoidTextSelection(this.$trigger);
	};

	Dropdown.prototype.show = function () {
		var that = this;

		if (that.active) {
			return that.hide();
		}

		// TODO: Move this code outside show method
		if (that.position === undefined) {
			// TODO: this implementation will be re done
			that.position = new ch.Positioner({
				'target': that.$container,
				'reference': that.$trigger,
				'side': that.options.side,
				'aligned': that.options.aligned,
				'offsetY': that.options.offsetY,
				'offsetX': that.options.offsetX
			});
		}

		that.position.refresh();

		that.collapsible.show();

		// Z-index of content and updates aria values
		that.$container.css('z-index', ch.util.zIndex += 1);

		// Z-index of trigger over content (secondary / skin dropdown)
		if (that.$el.hasClass('ch-dropdown-skin')) {
			that.$trigger.css('z-index', ch.util.zIndex += 1);
		}

		// Reset all dropdowns except itself
		$.each(ch.instances.dropdown, function (i, widget) {
			if (widget.uid !== that.uid) {
				widget.hide();
			}
		});

		that.$options[0].focus();

		// Turn on keyboards arrows
		that.arrowsOn();
	};

	Dropdown.prototype.hide = function () {
		var that = this;

		if (!that.active) {
			return that;
		}

		that.collapsible.hide();

		// Turn off keyboards arrows
		that.arrowsOff();
	};

	/**
	 * Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	 * @name isActive
	 * @methodOf ch.Dropdown#isActive
	 * @returns {boolean}
	 * @exampleDescription
	 * @example
	 * if (widget.isActive()) {
	 *     fn();
	 * }
	 */
	Dropdown.prototype.isActive = function () {
		return this.active;
	};

	/**
	 * Turns on keyboard arrows
	 * @protected
	 * @Object
	 * @memberOf ch.dropdown#arrowsOn
	 * @name on
	 */
	Dropdown.prototype.arrowsOn = (function () {
		var selected,
			map = {},
			arrow,
			optionsLength,
			selectOption = function (key) {
				var that = this;

				// Sets the arrow that user press
				arrow = key.type;

				// Sets limits behaivor
				if (selected === (arrow === 'down_arrow' ? optionsLength - 1 : 0)) { return; }

				// Unselects current option
				that.$options[selected].blur();

				if (arrow === 'down_arrow') { selected += 1; } else { selected -= 1; }

				// Selects new current option
				that.$options[selected].focus();
			};

		return function () {
			var that = this;

			// Keyboard support initialize
			selected = 0;

			optionsLength = that.$options.length;

			// Item selected by mouseover
			$.each(that.$options, function (i, e) {
				$(e).on('mouseenter.dropdown', function () {
					that.$options[selected = i].focus();
				});
			});

			// Creates keyboard shortcuts map and binding events
			map[ch.events.key.UP_ARROW + '.dropdown ' + ch.events.key.DOWN_ARROW + '.dropdown'] = function (key, event) {

				// Validations
				if (!that.active) { return; }

				// Prevent default behaivor
				ch.util.prevent(event);
				selectOption.call(that, key);
			}

			$document.on(map);

			return that;
		}
	}());

	/**
	 * Turns off keyboard arrows
	 * @protected
	 * @Object
	 * @memberOf ch.dropdown#arrowsOff
	 * @name off
	 */
	Dropdown.prototype.arrowsOff = function () {
		$document.off(ch.events.key.UP_ARROW + '.dropdown ' + ch.events.key.DOWN_ARROW + '.dropdown');
	};

	ch.factory(Dropdown);

}(this, this.jQuery, this.ch));