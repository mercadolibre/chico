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
 * @param {Boolean} [options.icon] Shows an arrow as icon. By default, the value is true.
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

	var $document = $(window.document);

	function Dropdown($el, options) {

		this.init($el, options);

		/**
		 * Private Members
		 */

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @type {Object}
		 */
		var that = this;


		/**
		 *  Protected Members
		 */

		/**
		 * Status of component
		 * @protected
		 * @type {Boolean}
		 * @ignore
		 */
		 that.active = false;

		/**
		 * The component's trigger.
		 * @protected
		 * @name ch.Dropdown#$trigger
		 * @type jQuery
		 */
		this.$trigger = (function () {

			var $trigger = that.$el.children(':first-child');

			if (!that.$el.hasClass('ch-dropdown-skin')) {
				$trigger.addClass('ch-btn-skin ch-btn-small');
			}

			return $trigger;

		}());

		/**
		 * The component's content.
		 * @protected
		 * @name ch.Dropdown#$content
		 * @type jQuery
		 */
		this.$content = (function () {

			// jQuery Object
			var $content = that.$el.children(':last-child')
			// Prevent click on content (except links)
				.on('click.dropdown', function (event) {
					if ((event.target || event.srcElement).tagName === 'A') {
						that.hide();
					}
					event.stopPropagation();
				})
			// WAI-ARIA properties
				.attr({'role': 'menu', 'aria-hidden': 'true' });

			// WAI-ARIA for options into content
			$content.children('a').attr('role', 'menuitem');

			// Position
			// that.position = ch.Positioner({
			// 	'element': $content,
			// 	'context': that.$trigger,
			// 	'points': that.options.points,
			// 	'offset': '0 -1',
			// 	'reposition': that.options.reposition
			// });

			that.position = new ch.Positioner({
				'target': $content,
				'reference': that.$trigger,
				'side': 'bottom',
				'aligned': 'left',
				'offset': '0 -1'
			});

			return $content;
		}());


		/**
		 * Dropdown options.
		 * @protected
		 * @type {Selector}
		 */
		that.$options = this.$content.find('a');

		/**
		 * Keyboard events object.
		 * @protected
		 * @Object
		 * @name ch.Dropdown#shortcuts
		 */
		this.shortcuts = {};

		/**
		 * Turns on keyboard shortcuts
		 * @protected
		 * @Object
		 * @memberOf ch.dropdown#shortcuts
		 * @name on
		 */
		this.shortcuts.on = (function () {
			var selected,
				map = {},
				arrow,
				optionsLength = that.$options.length,
				selectOption = function (key) {

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
				// Keyboard support initialize
				selected = 0;

				// Item selected by mouseover
				$.each(that.$options, function (i, e) {
					$(e).on('mouseenter.dropdown', function () {
						that.$options[selected = i].focus();
					});
				});

				// Creates keyboard shortcuts map and binding events
				map['click.dropdown ' + ch.events.key.ESC + '.dropdown'] = function () {
					that.hide();
				};

				map[ch.events.key.UP_ARROW + '.dropdown ' + ch.events.key.DOWN_ARROW + '.dropdown'] = function (key, event) {

					// Validations
					if (!that.active) { return; }

					// Prevent default behaivor
					ch.util.prevent(event);
					selectOption(key);
				}

				$document.on(map);
			}
		}());

		/**
		 * Turns off keyboard shortcuts
		 * @protected
		 * @Object
		 * @memberOf ch.dropdown#shortcuts
		 * @name off
		 */
		this.shortcuts.off = function () {
			$document.off('.dropdown');
		};

		/**
		 *  Default behaivor
		 */
		that.configBehavior();
		that.$el.addClass('ch-' + that['name']);
		ch.util.avoidTextSelection(this.$trigger);

		/**
		 * Triggers when the component is ready to use (Since 0.8.0).
		 * @name ch.Dropdown#ready
		 * @event
		 * @public
		 * @since 0.8.0
		 * @exampleDescription Following the first example, using <code>widget</code> as dropdown's instance controller:
		 * @example
		 * widget.on('ready',function () {
		 *	this.show();
		 * });
		 */
		window.setTimeout(function(){ that.trigger('ready')}, 50);

		return this;
	}

	/**
	 *	Inheritance
	 */
	ch.util.inherits(Dropdown, ch.Navs);

	Dropdown.prototype.name = 'dropdown';

	Dropdown.prototype.constructor = Dropdown;

	Dropdown.prototype.defaults = {
		'icon': true,
		'open': false,
		'fx': false,
		'reposition': true,
		'points': 'lt lb'
	};

	Dropdown.prototype.show = function () {
		var that = this;

		// Z-index of content and updates aria values
		this.$content.css('z-index', ch.util.zIndex += 1).attr('aria-hidden', 'false');

		// Z-index of trigger over content (secondary / skin dropdown)
		if (this.$el.hasClass('ch-dropdown-skin')) { this.$trigger.css('z-index', ch.util.zIndex += 1); }

		// Inheritance innerShow
		this.uber.show.call(this);

		// Refresh position
		//this.position('refresh');

		//this.position.update({'side': 'bottom', 'aligned': 'left'});

		// Reset all dropdowns except itself
		$.each(ch.instances.dropdown, function (i, e) {
			if (e.uid !== that.uid) { e.hide(); }
		});

		this.$options[0].focus();

		// Turn on keyboards shortcuts
		this.shortcuts.on();

		return this;
	};

	Dropdown.prototype.hide = function () {
		// Call to uber method
		this.uber.hide.call(this);

		// Updates aria values
		this.$content.attr('aria-hidden', 'true');

		// Turn off keyboards shortcuts
		this.shortcuts.off();

		return this;
	};

	ch.factory(Dropdown);

}(this, this.jQuery, this.ch));