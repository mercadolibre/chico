/**
* Tabs lets you create tabs for static and dynamic content.
* @name Tabs
* @class Tabs
* @augments ch.Widget
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Number} [conf.selected] Selects a child that will be open when component was loaded. By default, the value is 1.
* @returns itself
* @factorized
* @exampleDescription Create a new Tab Navigator without configuration.
* @example
* var widget = $(".example").tabs();
* @exampleDescription Create a new Tab Navigator with configuration.
* @example
* var widget = $(".example").tabs({
*     "selected": 2
* });
* @see ch.Widget
*/
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Tabs($el, conf) {
		/**
		 * Reference to a internal component instance, saves all the information and configuration properties.
		 * @private
		 * @name ch.Tabs#that
		 * @type object
		 */
		var that = this;

		that.$element = $el;
		that.element = $el[0];
		that.type = 'tabs';
		conf = conf || {};

		conf = ch.util.clone(conf);

		that.conf = conf;

		/**
		 * Inheritance
		 */

		that = ch.Widget.call(that);
		that.parent = ch.util.clone(that);

	/**
	*	Private Members
	*/

		// Add CSS class to the main element
		that.$element.addClass("ch-tabs");

		/**
		* The actual location hash, is used to know if there's a specific tab selected.
		* @private
		* @name ch.Tabs#hash
		* @type string
		*/
		var hash = window.location.hash.replace("#!/", ""),

		/**
		* A boolean property to know if the some tag should be selected.
		* @private
		* @name ch.Tabs#hashed
		* @type boolean
		* @default false
		*/
			hashed = false,

		/**
		* Get wich tab is selected.
		* @private
		* @name ch.Tabs#selected
		* @type number
		*/
			selected = conf.selected || conf.num || undefined,

		/**
		* Create controller's children.
		* @private
		* @name ch.Tabs#createTabs
		* @function
		*/
			createTabs = function () {

				// Children
				that.$triggers.find("a").each(function (i, e) {

					// Tab context
					var tab = {};
						tab.uid = that.uid + "#" + i;
						tab.type = tab.name = "tab";
						tab.element = e;
						tab.$element = $(e);
						tab.controller = that["public"];

					// Tab configuration
					var config = {};
						config.open = (selected === i);
						config.onShow = function () { selected = i; };

					if (ch.util.hasOwn(that.conf, "cache")) { config.cache = that.conf.cache; }

					/**
					* Fired when the content of one dynamic tab loads.
					* @name ch.Tabs#contentLoad
					* @event
					* @public
					*/
					if (ch.util.hasOwn(that.conf, "onContentLoad")) { config.onContentLoad = that.conf.onContentLoad; }

					/**
					* Fired when the content of one dynamic tab did not load.
					* @name ch.Tabs#contentError
					* @event
					* @public
					*/
					if (ch.util.hasOwn(that.conf, "onContentError")) { config.onContentError = that.conf.onContentError; }

					// Create Tabs
					that.children.push(ch.Tab.call(tab, config));

					// Bind new click to have control
					$(e).on("click", function (event) {
						ch.util.prevent(event);
						select(i);
					});

				});

				return;

			},

		/**
		* Select a child to show its content.
		* @name ch.Tabs#select
		* @private
		* @function
		*/
			select = function (index) {

					// Sets the tab's index
				var tab = that.children[index];

				// If select a tab that doesn't exist do nothing
				// Don't click me if I'm open
				if (!tab || index === selected) {
					return that;
				}

				// Hides the open tab
				if (typeof selected !== "undefined") {
					that.children[selected].innerHide();
				}

				// Shows the current tab
				tab.innerShow();

				// Updated selected index
				selected = index;

				//Change location hash
				window.location.hash = "#!/" + tab.$content.attr("id");

				/**
				* Fired when a tab is selected.
				* @name ch.Tabs#select
				* @event
				* @public
				*/
				that.trigger("select");

				// Callback
				that.callbacks("onSelect");

				return that;
			};

	/**
	*	Protected Members
	*/

		/**
		* Collection of children.
		* @name ch.Form#children
		* @type {Array}
		*/
		that.children = [];


		/**
		* The component's triggers container.
		* @protected
		* @name ch.Tabs#$triggers
		* @type jQuery
		*/
		that.$triggers = that.$element.children(":first").addClass("ch-tabs-triggers").attr("role", "tablist");

		/**
		* The component's content.
		* @protected
		* @name ch.Tabs#$content
		* @type jQuery
		*/
		that.$content = that.$triggers.next().addClass("ch-tabs-content ch-box-lite").attr("role", "presentation");

	/**
	*	Public Members
	*/

		/**
		 * @borrows ch.Widget#uid as ch.Tabs#uid
		 * @borrows ch.Widget#element as ch.Tabs#element
		 * @borrows ch.Widget#type as ch.Tabs#type
		 */

		/**
		* Children instances associated to this controller.
		* @public
		* @name ch.Tabs#children
		* @type collection
		*/
		that["public"].children = that.children;

		/**
		* Select a specific tab or get the selected tab.
		* @public
		* @name ch.Tabs#select
		* @function
		* @param {Number} [tab] Tab's index.
		* @exampleDescription Selects a specific tab
		* @example
		* widget.select(2);
		* @exampleDescription Returns the selected tab's index
		* @example
		* var selected = widget.select();
		*/
		that["public"].select = function (tab) {
			// Returns selected tab instead set it
			// Getter
			if (!parseInt(tab)) {
				return selected + 1;
			}

			// Setter
			select(tab -= 1);
			return that["public"];
		};

	/**
	*	Default event delegation
	*/

		createTabs();

		// If hash open that tab
		for(var i = that.children.length; i--;) {
			if (that.children[i].$content.attr("id") === hash) {
				select(i);
				hashed = true;
				break;
			}
		};

		// Shows the first tab if not hash or it's hash and it isn't from the current tab
		if( !hash || ( hash && !hashed ) ){
			that.children[0].innerShow();
			selected = 0;
		}

		/**
		* Triggers when the component is ready to use (Since 0.8.0).
		* @name ch.Tabs#ready
		* @event
		* @public
		* @since 0.8.0
		* @example
		* // Following the first example, using <code>widget</code> as Tabs's instance controller:
		* widget.on("ready",function () {
		*	this.show();
		* });
		*/
		//This avoit to trigger execute after the component was instanciated
		setTimeout(function(){that.trigger("ready")}, 50);

		return that['public'];
	}

	Tabs.prototype.name = 'tabs';
	Tabs.prototype.constructor = Tabs;

	ch.factory(Tabs);

	$.fn.tabNavigator = $.fn.tabs;

}(this, this.jQuery, this.ch));


/**
* Tab is a simple unit of content for Tabs.
* @abstract
* @name Tab
* @class Tab
* @augments ch.Navs
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
* @ignore
*/
(function (window, $, ch) {
	'use strict';

	if (window.ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Tab(conf) {
		/**
		* Reference to a internal component instance, saves all the information and configuration properties.
		* @private
		* @name ch.Tab#that
		* @type object
		* @ignore
		*/
		var that = this;
		conf = ch.util.clone(conf);
		conf.icon = false;

		that.conf = conf;

	/**
	*	Inheritance
	*/

		that = ch.Widget.call(that);
		that.parent = ch.util.clone(that);

	/**
	 * Abilities
	 */

		ch.Content.call(that);

		/**
		 * This callback is triggered when content request have finished.
		 * @protected
		 * @name ch.Floats#onmessage
		 * @function
		 * @returns {this}
		 */
		that.content.onmessage = function (data) {

			that.$content.html(data);

			that.trigger("contentLoad");
			if (ch.util.hasOwn(conf, "onContentLoad")) {
				conf.onContentLoad.call((that.controller || that), data);
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

			that.$content.html(data);

			that.trigger("contentError");
			if (ch.util.hasOwn(conf, "onContentError")) {
				conf.onContentError.call((that.controller || that), data.jqXHR, data.textStatus, data.errorThrown);
			}
		};

	/**
	*	Private Members
	*/
		/**
		* Creates the basic structure for the tab's content.
		* @private
		* @name ch.Tab#createContent
		* @function
		* @ignore
		*/
		var createContent = function () {

			var href = that.element.href.split("#"),
				controller = that.$element.parents(".ch-tabs"),
				content = controller.find("#" + href[1]);

			// If there are a tabContent...
			if (content.length > 0) {
				return content;

			// If tabContent doesn't exists
			} else {
				/**
				* Content configuration property.
				* @public
				* @name ch.Tab#source
				* @type string
				* @ignore
				*/
				that.source = that.element.href;

				that.content.configure({
					'input': that.source
				});

				var id = (href.length === 2) ? href[1] : "ch-tab" + that.uid.replace("#", "-");

				// Create tabContent
				return $("<div id=\"" + id + "\" role=\"tabpanel\" class=\"ch-hide\">").appendTo(controller.children().eq(1));
			}

		};

	/**
	*	Protected Members
	*/
		/**
		* Reference to the trigger element.
		* @protected
		* @name ch.Tab#$trigger
		* @type jQuery
		* @ignore
		*/
		that.$trigger = that.$element;

		/**
		* The component's content.
		* @protected
		* @name ch.Tab#$content
		* @type jQuery
		* @ignore
		*/
		that.$content = createContent();

		/**
		* Shows component's content.
		* @protected
		* @function
		* @name ch.Tab#innerShow
		* @returns itself
		* @ignore
		*/
		that.innerShow = function (event) {
			ch.util.prevent(event);

			that.active = true;

			// Load my content if I'need an ajax request
			if (ch.util.hasOwn(that, "source")) { that.content.set(); }

			// Show me
			that.$trigger.addClass("ch-" + that["type"] + "-trigger-on");

			// Set me as hidden false
			that.$content
				.attr("aria-hidden", "false")
				.removeClass("ch-hide");

			return that;
		};

		/**
		* Hides component's content.
		* @protected
		* @function
		* @name ch.Tab#innerHide
		* @returns itself
		* @ignore
		*/
		that.innerHide = function (event) {
			ch.util.prevent(event);

			if (!that.active) { return; }

			that.active = false;

			// Hide me
			that.$trigger.removeClass("ch-" + that["type"] + "-trigger-on");

			// Set all inactive tabs as hidden
			that.$content
				.attr("aria-hidden", "true")
				.addClass("ch-hide");

			return that;
		};

		/**
		* This callback is triggered when async data is loaded into component's content, when ajax content comes back.
		* @protected
		* @name ch.Tab#contentCallback
		* @ignore
		*/
		that["public"].on("contentLoad", function (event, context) {

			that.$content.html(that.staticContent);

			if (ch.util.hasOwn(conf, "onContentLoad")) {
				conf.onContentLoad.call(context, that.staticContent);
			}

		});

		/**
		* This callback is triggered when async request fails.
		* @public
		* @name contentCallback
		* @returns {Chico-UI Object}
		* @memberOf ch.Tabs
		* @ignore
		*/
		that["public"].on("contentError", function (event, data) {

			that.$content.html(that.staticContent);

			// Get the original that.source
			var originalSource = that.source;

			if (ch.util.hasOwn(conf, "onContentError")) {
				conf.onContentError.call(data.context, data.jqXHR, data.textStatus, data.errorThrown);
			}

			// Reset content configuration
			that.source = originalSource;

			that.staticContent = undefined;

		});

	/**
	*	Public Members
	*/

	/**
	*	Default event delegation
	*/

		// Add the attributes for WAI-ARIA to the tabs and tabpanel
		// By default is hidden
		that.$content.attr({
			"role": "tabpanel",
			"aria-hidden": true,
			"class": "ch-hide"
		});

		that.$trigger.attr({
			"role": "tab",
			"arial-controls": that.$content.attr("id"),
			"class": "ch-tab-trigger"
		});

		return that;
	}

	Tab.prototype.name = 'tab';
	Tab.prototype.constructor = Tab;

	ch.Tab = Tab;

}(this, this.jQuery, this.ch));