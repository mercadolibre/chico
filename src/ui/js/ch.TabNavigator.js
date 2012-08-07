/**
* TabNavigator lets you create tabs for static and dynamic content.
* @name TabNavigator
* @class TabNavigator
* @augments ch.Controllers
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Number} [conf.selected] Selects a child that will be open when component was loaded. By default, the value is 1.
* @returns itself
* @factorized
* @exampleDescription Create a new Tab Navigator without configuration.
* @example
* var widget = $(".example").tabNavigator();
* @exampleDescription Create a new Tab Navigator with configuration.
* @example
* var widget = $(".example").tabNavigator({
*     "selected": 2
* });
* @see ch.Controllers
*/

ch.tabNavigator = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.TabNavigator#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.controllers.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/

	// Add CSS class to the main element 
	that.$element.addClass("ch-tabNavigator");

	/**
	* The actual location hash, is used to know if there's a specific tab selected.
	* @private
	* @name ch.TabNavigator#hash
	* @type string
	*/
	var hash = window.location.hash.replace("#!/", ""),

	/**
	* A boolean property to know if the some tag should be selected.
	* @private
	* @name ch.TabNavigator#hashed
	* @type boolean
	* @default false
	*/
		hashed = false,

	/**
	* Get wich tab is selected.
	* @private
	* @name ch.TabNavigator#selected
	* @type number
	*/
		selected = conf.selected || conf.value || undefined,

	/**
	* Create controller's children.
	* @private
	* @name ch.TabNavigator#createTabs
	* @function
	*/
		createTabs = function () {
	
			// Children
			that.$triggers.find("a").each(function (i, e) {
	
				// Tab context
				var tab = {};
					tab.uid = that.uid + "#" + i;
					tab.type = "tab";
					tab.element = e;
					tab.$element = $(e);
					tab.controller = that["public"];
	
				// Tab configuration
				var config = {};
					config.open = (selected === i);
					config.onShow = function () { selected = i; };
				
				if (ch.utils.hasOwn(that.conf, "cache")) { config.cache = that.conf.cache; }
	
				/**
				* Fired when the content of one dynamic tab loads.
				* @name ch.TabNavigator#contentLoad
				* @event
				* @public
				*/
				if (ch.utils.hasOwn(that.conf, "onContentLoad")) { config.onContentLoad = that.conf.onContentLoad; }
				
				/**
				* Fired when the content of one dynamic tab did not load.
				* @name ch.TabNavigator#contentError
				* @event
				* @public
				*/
				if (ch.utils.hasOwn(that.conf, "onContentError")) { config.onContentError = that.conf.onContentError; }
	
				// Create Tabs
				that.children.push(ch.tab.call(tab, config));
	
				// Bind new click to have control
				$(e).on("click", function (event) {
					that.prevent(event);
					select(i);
				});
	
			});
	
			return;
	
		},

	/**
	* Select a child to show its content.
	* @name ch.TabNavigator#select
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
			* @name ch.TabNavigator#select
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
	* The component's triggers container.
	* @protected
	* @name ch.TabNavigator#$triggers
	* @type jQuery
	*/
	that.$triggers = that.$element.children(":first").addClass("ch-tabNavigator-triggers").attr("role", "tablist");

	/**
	* The component's content.
	* @protected
	* @name ch.TabNavigator#$content
	* @type jQuery
	*/
	that.$content = that.$triggers.next().addClass("ch-tabNavigator-content ch-box").attr("role", "presentation");

/**
*	Public Members
*/

	/**
	* @borrows ch.Object#uid as ch.TabNavigator#uid
	*/	
	
	/**
	* @borrows ch.Object#element as ch.TabNavigator#element
	*/

	/**
	* @borrows ch.Object#type as ch.TabNavigator#type
	*/

	/**
	* Children instances associated to this controller.
	* @public
	* @name ch.TabNavigator#children
	* @type collection
	*/
	that["public"].children = that.children;

	/**
	* Select a specific tab or get the selected tab.
	* @public
	* @name ch.TabNavigator#select
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
			return selected;
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
	}
	
	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.TabNavigator#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using <code>widget</code> as tabNavigator's instance controller:
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	//This avoit to trigger execute after the component was instanciated
	setTimeout(function(){that.trigger("ready")}, 50);

	return that;

};

ch.factory("tabNavigator");

/**
* Tab is a simple unit of content for TabNavigators.
* @abstract
* @name Tab
* @class Tab
* @augments ch.Navs
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
* @ignore
*/

ch.tab = function (conf) {
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Tab#that
	* @type object
	* @ignore
	*/
	var that = this;

	conf = ch.clon(conf);
	conf.icon = false;

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);

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
			controller = that.$element.parents(".ch-tabNavigator"),
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
		that.prevent(event);

		that.active = true;

		// Load my content if I'need an ajax request 
		if (ch.utils.hasOwn(that, "source")) { that.content(); }

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
		that.prevent(event);

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

		if (ch.utils.hasOwn(conf, "onContentLoad")) {
			conf.onContentLoad.call(context, that.staticContent);
		}

	});

	/**
	* This callback is triggered when async request fails.
	* @public
	* @name contentCallback
	* @returns {Chico-UI Object}
	* @memberOf ch.TabNavigator
	* @ignore
	*/
	that["public"].on("contentError", function (event, data) {

		that.$content.html(that.staticContent);

		// Get the original that.source
		var originalSource = that.source;

		if (ch.utils.hasOwn(conf, "onContentError")) {
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