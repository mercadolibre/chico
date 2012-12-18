(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	/**
	 * Tooltip improves the native tooltips. Tooltip uses the 'alt' and 'title' attributes to grab its content.
	 * @name Tooltip
	 * @class Tooltip
	 * @augments ch.Floats
	 * @memberOf ch
	 * @param {Object} [conf] Object with configuration properties.
	 * @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
	 * @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
	 * @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
	 * @returns itself
	 * @factorized
	 * @see ch.Modal
	 * @see ch.Layer
	 * @see ch.Zoom
	 * @see ch.Flaots
	 * @exampleDescription Create a tooltip.
	 * @example
	 * var widget = $(".some-element").tooltip();
	 * @exampleDescription Create a new tooltip with configuration.
	 * @example
	 * var widget = $("a.example").tooltip({
	 *     "fx": false,
	 *     "offset": "10 -10",
	 *     "points": "lt rt"
	 * });
	 * @exampleDescription
	 * Now <code>widget</code> is a reference to the tooltip instance controller.
	 * You can set a new content by using <code>widget</code> like this:
	 * @example
	 * widget.width(300);
	 */
	function Tooltip($el, options) {

		this.init($el, options);

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @type {Object}
		 */
		var that = this;

		window.setTimeout(function () { that.emit('ready'); }, 50);
	}

	/**
	 * Private members
	 */
	var $body = $('body'),
		/**
		 *	Inheritance
		 */
		parent = ch.util.inherits(Tooltip, ch.Widget);

	/**
	 * Public members
	 */
	Tooltip.prototype.name = 'tooltip';

	Tooltip.prototype.constructor = Tooltip;

	Tooltip.prototype.defaults = {
		'fx': true,
		'classes': 'ch-box-lite',
		'width': 'auto',
		'height': 'auto',
		'side': 'bottom',
		'aligned': 'left',
		'offsetY': 10,
		'offsetX': 0
	};

	Tooltip.prototype.init = function ($el, options) {

		parent.init.call(this, $el, options);

		this.require('Content');

		/**
		 * Content configuration property.
		 * @protected
		 * @name ch.Tooltip#source
		 */
		this.content.configure({
			'input': this.options.content || this.el.title || this.el.alt
		});

		var that = this;

		/**
		 * This callback is triggered when content request have finished.
		 * @protected
		 * @name ch.Floats#onmessage
		 * @function
		 * @returns {this}
		 */
		this.content.onmessage = function (data) {

			that.$content.html(data);

			that.emit('contentLoad');

			//that.position('refresh');
		};

		/**
		 * This callback is triggered when async request fails.
		 * @protected
		 * @name ch.Floats#onerror
		 * @function
		 * @returns {this}
		 */
		this.content.onerror = function (data) {

			that.$content.html(data);

			that.emit('contentError');

			//that.position('refresh');
		};

		/**
		 * The attribute that will provide the content. It can be "title" or "alt" attributes.
		 * @protected
		 * @name ch.Tooltip#attrReference
		 * @type string
		 */
		this.attrReference = ch.util.hasOwn(this.el, 'title') ? 'title' : 'alt';

		/**
		 * The original attribute content.
		 * @private
		 * @name ch.Tooltip#attrContent
		 * @type string
		 */
		this.attrContent = this.el.title || this.el.alt;


		this.$el
			.attr('aria-describedby', 'ch-tooltip-' + this.uid)
			.on('mouseenter.tooltip', function (event) {
				ch.util.prevent(event);
				that.show();
			})
			.on('mouseleave.tooltip', function (event) {
				ch.util.prevent(event);
				that.hide();
			});

		/**
		 * Inner function that resolves the component's layout and returns a static reference.
		 * @protected
		 * @name ch.Floats#$container
		 * @type jQuery
		 */
		this.$container = $('<div>')
			.addClass('ch-tooltip ch-cone ch-hide ' + this.options.classes)
			.attr({
				'role': 'tooltip',
				'id': 'ch-tooltip-' + this.uid
			})
			.css({
				'z-index': (ch.util.zIndex += 1),
				'width': this.options.width,
				'height': this.options.height
			});

		/**
		 * Inner reference to content container. Here is where the content will be added.
		 * @protected
		 * @name ch.Floats#$content
		 * @type jQuery
		 * @see ch.Content
		 */
		this.$content = $('<div class="ch-tooltip-content">').appendTo(this.$container);

		this.position = new ch.Positioner({
			'target': this.$container,
			'reference': this.$el,
			'side': this.options.side,
			'aligned': this.options.aligned,
			'offsetY': this.options.offsetY,
			'offsetX': this.options.offsetX
		});
	};

	Tooltip.prototype.active = false;

	/**
	 * Inner show method. Attach the component layout to the DOM tree.
	 * @protected
	 * @name ch.Tooltip#innerShow
	 * @function
	 * @returns itself
	 */
	Tooltip.prototype.show = function () {

		var that = this;

		// Avoid showing things that are already shown
		if (this.active) { return; }

		this.active = true;

		// Reset all tooltip, except me
		$.each(ch.instances.tooltip, function (i, e) {
			if (e !== that) {
				e.hide();
			}
		});

		// IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		this.el[this.attrReference] = '';

		// Add layout to DOM tree and increment zIndex
		this.$container.css('z-index', (ch.util.zIndex += 1)).appendTo($body);

		// Request the content
		this.content.set();

		this.position.refresh();

		function afterShow() {

			that.$container.removeClass('ch-hide');

			//that.position("refresh");

			/**
			 * Triggers when component is visible.
			 * @name ch.Floats#show
			 * @event
			 * @public
			 * @exampleDescription It change the content when the component was shown.
			 * @example
			 * widget.on("show",function () {
			 * this.content("Some new content");
			 * });
			 * @see ch.Floats#show
			 */
			that.emit('show');
		}

		if (this.options.fx) {
			this.$container.fadeIn('fast', afterShow);
		} else {
			afterShow();
		}

		return this;
	};

	/**
	 * Inner hide method. Hides the component and detach it from DOM tree.
	 * @protected
	 * @name ch.Tooltip#innerHide
	 * @function
	 * @returns itself
	 */
	Tooltip.prototype.hide = function () {

		var that = this;

		if (!this.active) { return; }

		this.active = false;

		this.el[this.attrReference] = this.attrContent;

		function afterHide() {

			that.$container.detach();

			/**
			 * Triggers when component is not longer visible.
			 * @name ch.Floats#hide
			 * @event
			 * @public
			 * @exampleDescription When the component hides show other component.
			 * @example
			 * widget.on("hide",function () {
			 * otherComponent.show();
			 * });
			 */
			that.emit('hide');
		}

		if (this.options.fx) {
			that.$container.fadeOut('fast', afterHide);
		} else {
			that.$container.addClass('ch-hide');
			afterHide();
		}

		return this;
	};

	/**
	 * Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	 * @public
	 * @function
	 * @name ch.Floats#isActive
	 * @returns boolean
	 */
	Tooltip.prototype.isActive = function () {
		return this.active;
	};

	/**
	 * Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	 * @public
	 * @function
	 * @name ch.Floats#width
	 * @param {Number|String} [width]
	 * @returns itself
	 * @see ch.Zarasa#size
	 * @see ch.Floats#size
	 * @exampleDescription to set the width
	 * @example
	 * widget.width(700);
	 * @exampleDescription to get the width
	 * @example
	 * widget.width() // 700
	 */
	Tooltip.prototype.width = function (data) {

		if (data !== undefined) {
			this.$container.css('width', this.options.width = data);
			return this;
		} else {
			return this.options.width;
		}
	};

	/**
	 * Sets or gets the height of the Float element.
	 * @public
	 * @function
	 * @name ch.Floats#height
	 * @returns itself
	 * @see ch.Floats#size
	 * @exampleDescription to set the height
	 * @example
	 * widget.height(300);
	 * @exampleDescription to get the height
	 * @example
	 * widget.height // 300
	 */
	Tooltip.prototype.height = function (data) {

		if (data !== undefined) {
			this.$container.css('height', this.options.height = data);
			return this;
		} else {
			return this.options.height;
		}
	};

	ch.factory(Tooltip);

}(this, this.jQuery, this.ch));