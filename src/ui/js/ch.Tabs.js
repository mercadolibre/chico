/**
 * Tabs lets you create tabs for static and dynamic content.
 * @name Tabs
 * @class Tabs
 * @augments ch.Widget
 * @memberOf ch
 * @param {Object} [options] Object with configuration properties.
 * @param {Number} [options.selected] Selects a child that will be open when component was loaded. By default, the value is 1.
 * @returns itself
 * @factorized
 * @exampleDescription Create a new Tab Navigator without configuration.
 * @example
 * var widget = $('.example').tabs();
 * @exampleDescription Create a new Tab Navigator with configuration.
 * @example
 * var widget = $('.example').tabs({
 *     'selected': 2
 * });
 * @see ch.Widget
 */
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Tabs($el, options) {
		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @type {Object}
		 */
		var that = this;

		that.init($el, options);

		/**
		 * Triggers when the component is ready to use (Since 0.8.0).
		 * @name ch.Tabs#ready
		 * @event
		 * @public
		 * @since 0.8.0
		 * @example
		 * // Following the first example, using <code>widget</code> as Tabs's instance controller:
		 * widget.on('ready',function () {
		 *	this.show();
		 * });
		 */
		//This avoit to trigger execute after the component was instanciated
		window.setTimeout(function () { that.emit('ready'); }, 50);
	}

	/**
	 * Inheritance
	 */
	var	parent = ch.util.inherits(Tabs, ch.Widget);

	/**
	 * Prototype
	 */
	Tabs.prototype.name = 'tabs';

	Tabs.prototype.constructor = Tabs;

	Tabs.prototype._defaults = {
		'selected': 0,
		'cache': true
	};

	Tabs.prototype.init = function ($el, options) {
		parent.init.call(this, $el, options);

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @type {Object}
		 */
		var that = this;

		/**
		* The actual location hash, is used to know if there's a specific tab selected.
		* @protected
		* @name ch.Tabs#hash
		* @type {String}
		*/
		that.hash = window.location.hash.replace('#!/', ''),

		/**
		* A boolean property to know if the some tag should be selected.
		* @protected
		* @name ch.Tabs#hashed
		* @type {Boolean}
		* @default false
		*/
		that.hashed = false,

		/**
		* Get wich tab is selected.
		* @protected
		* @name ch.Tabs#selected
		* @type {Number}
		*/
		that.selected = that._options.selected || that._options.num || undefined;

		/**
		 * Children instances associated to this controller.
		 * @name ch.Form#children
		 * @type {Array}
		 */
		that.children = [];

		/**
		 * The component's triggers container.
		 * @protected
		 * @name ch.Tabs#$triggers
		 * @type {jQuery}
		 */
		that.$triggers = that.$el.children(':first-child');

		/**
		 * The component's container.
		 * @protected
		 * @name ch.Tabs#$container
		 * @type {jQuery}
		 */
		that.$container = that.$el.children(':last-child');

		/**
		 * Default behavior
		 */
		that.$el.addClass('ch-tabs');

		that.$triggers
			.addClass('ch-tabs-triggers')
			.attr('role', 'tablist');

		that.$container
			.addClass('ch-tabs-container ch-box-lite')
			.attr('role', 'presentation');


		// Creates individual tab
		that.createTabs();

		that.hasHash();

		return this;
	};

	/**
	 * Create controller's children.
	 * @protected
	 * @name ch.Tabs#createTabs
	 * @function
	 */
	Tabs.prototype.createTabs = function () {
		var that = this;

		// Children
		that.$triggers.find('a').each(function (i, e) {

			// Tab configuration
			var config = {};
			config.open = (that.selected === i);
			config.onShow = function () { that.selected = i; };
			config.controller = that;

			if (ch.util.hasOwn(that._options, 'cache')) { config.cache = that._options.cache; }

			/**
			* Fired when the content of one dynamic tab loads.
			* @name ch.Tabs#contentLoad
			* @event
			* @public
			*/
			if (ch.util.hasOwn(that._options, 'onContentLoad')) { config.onContentLoad = that._options.onContentLoad; }

			/**
			* Fired when the content of one dynamic tab did not load.
			* @name ch.Tabs#contentError
			* @event
			* @public
			*/
			if (ch.util.hasOwn(that._options, 'onContentError')) { config.onContentError = that._options.onContentError; }

			// Create Tabs
			that.children.push(new ch.Tab($(e), config));

			// Bind new click to have control
			$(e).on('click', function (event) {
				ch.util.prevent(event);
				that.select(i);
			});

		});

		return that;
	};

	Tabs.prototype.hasHash = function () {
		var that = this;

		// If hash open that tab
		for(var i = that.children.length; i--;) {
			if (that.children[i].$container.attr('id') === that.hash) {
				that.select(i);
				that.hashed = true;
				break;
			}
		};

		// Shows the first tab if not hash or it's hash and it isn't from the current tab
		if( !that.hash || ( that.hash && !that.hashed ) ){
			that.children[0].show();
			that.selected = 0;
		}
	};

	/**
	 * Select a specific tab or get the selected tab.
	 * @public
	 * @name ch.Tabs#select
	 * @function
	 * @param {Number} [tab] Tab's index.
	 * @exampleDescription Selects a specific tab
	 * @example
	 * widget.select(0);
	 * @exampleDescription Returns the selected tab's index
	 * @example
	 * var selected = widget.select();
	 */
	Tabs.prototype.select = function (index) {
		if (index === undefined) {
			return this.selected;
		}

		var that = this,
			selected = that.selected,

			// Sets the tab's index
			tab = that.children[index];

		// If select a tab that doesn't exist do nothing
		// Don't click me if I'm open
		if (!tab || index === selected) {
			return that;
		}

		// Hides the open tab
		if (typeof selected !== 'undefined') {
			that.children[selected].hide();
		}

		// Shows the current tab
		tab.show();

		// Updated selected index
		selected = index;

		//Change location hash
		window.location.hash = '#!/' + tab.$container.attr('id');

		/**
		 * Fired when a tab is selected.
		 * @name ch.Tabs#select
		 * @event
		 * @public
		 */
		that.emit('select');

		// Callback
		that.callbacks('onSelect');

		return that;

	};

	ch.factory(Tabs);

}(this, this.jQuery, this.ch));

/**
 * Tab is a simple unit of content for Tabs.
 * @abstract
 * @name Tab
 * @class Tab
 * @augments ch.Navs
 * @memberOf ch
 * @param {object} options Object with configuration properties
 * @returns itself
 * @ignore
 */
 (function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Tab($el, options) {
		this.init($el, options);
	}

	/**
	 * Private
	 */
	var $html = $('html'),

		/**
		 * Inheritance
		 */
		parent = ch.util.inherits(Tab, ch.Widget);

	/**
	 * Prototype
	 */
	Tab.prototype.name = 'tab';

	Tab.prototype.constructor = Tab;

	Tab.prototype.defaults = {
		'icon': false
	};

	Tab.prototype.init = function ($el, options) {
		parent.init.call(this, $el, options);

		this.require('Collapsible', 'Content');

		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @type {Object}
		 */
		var that = this;

		/**
		 * Reference to the trigger element.
		 * @protected
		 * @name Tab#$trigger
		 * @type jQuery
		 * @ignore
		 */
		that.$trigger = that.$el;

		/**
		 * The component's content.
		 * @protected
		 * @name Tab#$content
		 * @type jQuery
		 * @ignore
		 */
		that.$container = that.createContent();

		/**
		 * This callback is triggered when content request have finished.
		 * @protected
		 * @name ch.Floats#onmessage
		 * @function
		 * @returns {this}
		 */
		that.content.onmessage = function (data) {

			that.$container.html(data);

			that._options.controller.emit('contentLoad');

			if (ch.util.hasOwn(that._options, 'onContentLoad')) {
				that._options.onContentLoad.call(that._options.controller, data);
			}
		};

		/**
		 * This callback is triggered when async request fails.
		 * @protected
		 * @name ch.Floats#onerror
		 * @function
		 * @returns {this}
		 */
		that.content.onerror = function (data) {

			that.$container.html(data);

			that.controller.trigger("contentError", data);

			if (ch.util.hasOwn(that._options, "onContentError")) {
				that._options.onContentError.call(that.controller, data.jqXHR, data.textStatus, data.errorThrown);
			}
		};

		// Add the attributes for WAI-ARIA to the tabs and tabpanel
		// By default is hidden
		that.$container.attr({
			"role": "tabpanel",
			"aria-hidden": true,
			"class": "ch-hide"
		});

		that.$trigger.attr({
			"role": "tab",
			"arial-controls": that.$container.attr("id"),
			"class": "ch-tab-trigger"
		});

		return that;
	};

	/**
	 * Creates the basic structure for the tab's content.
	 * @private
	 * @name Tab#createContent
	 * @function
	 * @ignore
	 */
	Tab.prototype.createContent = function () {
		var that = this,
			href = that.el.href.split("#"),
			controller = that.$el.parents(".ch-tabs"),
			content = controller.find("#" + href[1]);

		// If there are a tabContent...
		if (content.length > 0) {
			return content;

		// If tabContent doesn't exists
		} else {
			/**
			* Content configuration property.
			* @public
			* @name Tab#source
			* @type string
			* @ignore
			*/
			that.source = that.el.href;

			that.content.configure({
				'input': that.source
			});

			var id = (href.length === 2) ? href[1] : "ch-tab-" + that.uid;

			// Create tabContent
			return $("<div id=\"" + id + "\" role=\"tabpanel\" class=\"ch-hide\">").appendTo(controller.children().eq(1));
		}

		return that;
	};

	/**
	* Shows component's content.
	* @protected
	* @function
	* @name Tab#innerShow
	* @returns itself
	* @ignore
	*/
	Tab.prototype.show = function () {
		var that = this;

		that._active = true;

		// Load my content if I'need an ajax request
		if (ch.util.hasOwn(that, 'source')) { that.content.set(); }

		that._collapsible.show();

		return that;
	};

	/**
	* Hides component's content.
	* @protected
	* @function
	* @name Tab#innerHide
	* @returns itself
	* @ignore
	*/
	Tab.prototype.hide = function () {

		if (!this._active) { return; }

		this._collapsible.hide();

		return this;
	};

	ch.Tab = Tab;

}(this, this.jQuery, this.ch));