/**
* TabNavigator UI-Component for static and dinamic content.
* @name TabNavigator
* @class TabNavigator
* @augments ch.Controllers
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
*/

ch.tabNavigator = function(conf){

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

	/**
	* The actual location hash, is used to know if there's a specific tab selected.
	* @private
	* @name ch.TabNavigator#hash
	* @type string
	*/
	var hash = window.location.hash.replace("#!", "");

	/**
	* A boolean property to know if the some tag should be selected.
	* @private
	* @name ch.TabNavigator#hashed
	* @type boolean
	* @default false
	*/
	var hashed = false;

	/**
	* Get wich tab is selected.
	* @private
	* @name ch.TabNavigator#selected
	* @type number
	*/
	var selected = conf.selected - 1 || conf.value - 1 || 0;

	/**
	* Create controller's children.
	* @private
	* @name ch.TabNavigator#createTabs
	* @function
	*/

	var createTabs = function(){

		// Children
		that.$triggers.find("a").each(function(i, e){

			// Tab context
			var tab = {};
				tab.uid = that.uid + "#" + i;
				tab.type = "tab";
				tab.element = e;
				tab.$element = $(e);
				tab.controller = that["public"];
				
				tab.$element.attr("role","tab")

			// Tab configuration
			var config = {};
				config.open = (selected == i);
				config.onShow = function(){
					selected = i;
				};
			
			if(ch.utils.hasOwn(that.conf, "cache")) {
				config.cache = that.conf.cache;
			};

		/**
		* Callback function
		* @name ch.TabNavigator#onContentLoad
		* @event
		* @public
		*/
			if (ch.utils.hasOwn(that.conf, "onContentLoad")) config.onContentLoad = that.conf.onContentLoad;
		/**
		* Callback function
		* @name ch.TabNavigator#onContentError
		* @event
		* @public
		*/
			if (ch.utils.hasOwn(that.conf, "onContentError")) config.onContentError = that.conf.onContentError;

			// Create Tabs
			that.children.push(
				ch.tab.call(tab, config)
			);

			// Bind new click to have control
			$(e).unbind("click").bind("click", function(event){
				that.prevent(event);
				select(i + 1);
			});

		});

		return;

	};

	/**
	* Select a child to show its content.
	* @name ch.TabNavigator#select
	* @private
	* @function
	*/
	var select = function(tab){

		tab = that.children[tab - 1];

		if(tab === that.children[selected]) return; // Don't click me if I'm open

		// Hide my open bro
		$.each(that.children, function(i, e){
			if(tab !== e) e.hide();
		});

		tab.show();

		//Change location hash
		window.location.hash = "#!" + tab.$content.attr("id");

	/**
	* Callback function
	* @name ch.TabNavigator#onSelect
	* @event
	* @public
	*/
		that.callbacks("onSelect");
		// new callback
		that.trigger("select");

	return that;
	};

/**
*	Protected Members
*/

	/**
	* The component's triggers container.
	* @private
	* @name ch.TabNavigator#$triggers
	* @type jQuery
	*/
	that.$triggers = that.$element.children(":first").addClass("ch-tabNavigator-triggers").attr("role","tablist");

	/**
	* The component's content.
	* @private
	* @name ch.TabNavigator#$content
	* @type jQuery
	*/
	that.$content = that.$triggers.next().addClass("ch-tabNavigator-content box").attr("role","presentation");


/**
*	Public Members
*/

	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.TabNavigator#uid
	* @type number
	*/

	/**
	* The element reference.
	* @public
	* @name ch.TabNavigator#element
	* @type HTMLElement
	*/

	/**
	* The component's type.
	* @public
	* @name ch.TabNavigator#type
	* @type string
	*/

	/**
	* Children instances associated to this controller.
	* @public
	* @name ch.TabNavigator#children
	* @type collection
	*/
	that["public"].children = that.children;

	/**
	* Select a specific child.
	* @public
	* @function
	* @name ch.TabNavigator#select
	* @param {number} tab Tab's index.
	*/
	that["public"].select = function(tab){
		select(tab);

		return that["public"];
	};

	/**
	* Returns the selected child's index.
	* @public
	* @function
	* @name ch.TabNavigator#getSelected
	* @returns {number} selected Tab's index.
	*/
	that["public"].getSelected = function(){ return (selected + 1); };

/**
*	Default event delegation
*/

	that.$element.addClass("ch-tabNavigator");

	createTabs();

	//Default: Load hash tab or Open first tab	
	for(var i = that.children.length; i-=1; ){
		if ( that.children[i].$content.attr("id") === hash ) {
			select(i + 1);

			hashed = true;

			break;
		};
	};

	return that;

};

ch.factory("tabNavigator");

/**
* Simple unit of content for TabNavigators.
* @abstract
* @name Tab
* @class Tab
* @augments ch.Navs
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
*/

ch.tab = function(conf){
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Tab#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);
	conf.icon = false;

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.navs.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/
	/**
	* Creates the basic structure for the tab's content.
	* @private
	* @name ch.Tab#createContent
	* @function
	*/
	var createContent = function(){
		var href = that.element.href.split("#");
		var controller = that.$element.parents(".ch-tabNavigator");
		var content = controller.find("#" + href[1]);

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
			*/
			that.source = that.element.href;

			var id = (href.length == 2) ? href[1] : "ch-tab" + that.uid.replace("#","-");

			// Create tabContent
			return $("<div id=\"" + id + "\" role=\"tabpanel\" class=\"ch-hide\">").appendTo( controller.children().eq(1) );
		}

	};

/**
*	Protected Members
*/
	/**
	* Reference to the trigger element.
	* @private
	* @name ch.Tab#$trigger
	* @type jQuery
	*/
	that.$trigger = that.$element;

	/**
	* The component's content.
	* @private
	* @name ch.Tab#$content
	* @type jQuery
	*/
	that.$content = createContent();

	/**
	* Process the show event.
	* @private
	* @function
	* @name ch.Tab#show
	* @returns jQuery
	*/
	that.show = function(event){
		that.prevent(event);

		// Load my content if I'need an ajax request 
		if (ch.utils.hasOwn(that, "source")) {
			that.content();
		}

		// Show me
		that.parent.show(event);

		// Set me as hidden false
		that.$content.attr("aria-hidden","false");
		
		// It removes the class ch-js-hide because the content be visible on click
		that.$content.hasClass('ch-js-hide')?that.$content.removeClass('ch-js-hide'):null;

		// When click or enter to the tab, then it will be focused
		that.$trigger.focus();

		return that;
	};
	
	/**
	* Process the hide event.
	* @private
	* @function
	* @name ch.Tab#hide
	* @returns jQuery
	*/
	that.hide = function(event){
		that.prevent(event);

		// Hide me
		that.parent.hide(event);

		// Set all inactive tabs as hidden
		that.$content.attr("aria-hidden","true");

		return that;
	};

	/**
	* This callback is triggered when async data is loaded into component's content, when ajax content comes back.
	* @protected
	* @name ch.Tab#contentCallback
	*/
	that["public"].on("contentLoad", function(event, context){

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
	*/
	that["public"].on("contentError", function(event, data){

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

	that.configBehavior();
	var hidden = that.$content.hasClass("ch-hide")?true:false;
		that.$content.attr("role","tabpanel").attr("aria-hidden",hidden);
		that.$trigger.attr("role","tab");
	return that;
}