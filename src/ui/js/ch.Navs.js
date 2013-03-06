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
	Navs.prototype.show = function () {

		var that = this;

		if (this.active) {
			return this.hide();
		}

		this.active = true;

		this.$trigger.addClass('ch-' + this.name + '-trigger-on');

		// Animation
		if (this.options.fx) {
			this.$content.slideDown('fast', function () {
				// new callbacks
				that.emit('show');
				// old callback system
				that.callbacks('onShow');
			});
		} else {
			// new callbacks
			this.emit('show');
			// old callback system
			this.callbacks('onShow');
		}

		this.$content.removeClass('ch-hide');

		return this;
	};

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
	Navs.prototype.hide = function () {

		var that = this;

		if (!this.active) { return; }

		this.active = false;

		this.$trigger.removeClass('ch-' + this.name + '-trigger-on');

		// Animation
		if (this.options.fx) {
			this.$content.slideUp('fast', function () {
				that.callbacks('onHide');
				// new callbacks
				that.emit('hide');
			});
		} else {
			// new callbacks
			this.emit('hide');
			// old callback system
			this.callbacks('onHide');
		}

		this.$content.addClass('ch-hide');

		return this;
	};

	/**
	 * Create component's layout
	 * @protected
	 * @function
	 * @ignore
	 */
	Navs.prototype.configBehavior = function () {
		var that = this;

		this.$trigger
			.addClass('ch-' + this.name + '-trigger')
			.on('click.' + this.name, function (event) {
				ch.util.prevent(event);
				that.show();
			});

		this.$content.addClass('ch-' + this.name + '-content ch-hide');

		// Icon configuration
		if ($html.hasClass('lt-ie8') && this.options.icon) {
			$('<span class="ch-' + this.name + '-ico">Drop</span>').appendTo(this.$trigger);
		} else if (this.options.icon) {
			this.$trigger.addClass('ch-' + this.name + '-ico');
		}

		if (this.options.open) { this.show(); }

	};

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