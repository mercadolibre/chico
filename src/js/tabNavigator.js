
/**
* TabNavigator UI-Component for static and dinamic content.
* @name TabNavigator
* @class TabNavigator
* @augments ch.Controllers
* @memberOf ch
* @param {Configuration Object} conf Object with configuration properties
* @returns {Chico-UI Object}
*/

ch.tabNavigator = function(conf){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name that
	* @type {Object}
	* @memberOf ch.TabNavigator
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
	* @name hash
	* @type {String}
	* @memberOf ch.TabNavigator
	*/
	var hash = window.location.hash.replace("#!", "");
	/**
	* A boolean property to know if the some tag should be selected.
	* @private
	* @name hashed
	* @type {Boolean}
	* @default false
	* @memberOf ch.TabNavigator
	*/
	var hashed = false;
	/**
	* Get wich tab is selected.
	* @private
	* @name selected
	* @type {Number}
	* @memberOf ch.TabNavigator
	*/
	var selected = conf.selected - 1 || conf.value - 1 || 0;
	/**
	* Create controller's children.
	* @private
	* @name createTabs
	* @function
	* @memberOf ch.TabNavigator
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
		* @name onContentLoad
		* @type {Function}
		* @memberOf ch.TabNavigator
		*/
			if ( ch.utils.hasOwn(that.conf, "onContentLoad") ) config.onContentLoad = that.conf.onContentLoad;
		/**
		* Callback function
		* @name onContentError
		* @type {Function}
		* @memberOf ch.TabNavigator
		*/
			if ( ch.utils.hasOwn(that.conf, "onContentError") ) config.onContentError = that.conf.onContentError;

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
	* @private
	* @function
	* @memberOf ch.TabNavigator
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
	* @name onSelect
	* @type {Function}
	* @memberOf ch.TabNavigator
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
	* @name $triggers
	* @type {jQuery Object}
	* @memberOf ch.TabNavigator
	*/
	that.$triggers = that.$element.children(":first").addClass("ch-tabNavigator-triggers");
	
	/**
	* The component's content.
	* @private
	* @name $content
	* @type {jQuery Object}
	* @memberOf ch.TabNavigator
	*/
	that.$content = that.$triggers.next().addClass("ch-tabNavigator-content box");

	
/**
*	Public Members
*/

	/**
	* The component's instance unique identifier.
	* @public
	* @name uid
	* @type {Number}
	* @memberOf ch.TabNavigator
	*/
	that["public"].uid = that.uid;
	/**
	* The element reference.
	* @public
	* @name element
	* @type {HTMLElement}
	* @memberOf ch.TabNavigator
	*/
	that["public"].element = that.element;
	/**
	* The component's type.
	* @public
	* @name type
	* @type {String}
	* @memberOf ch.TabNavigator
	*/
	that["public"].type = that.type;
	/**
	* Children instances associated to this controller.
	* @public
	* @name children
	* @type {Collection}
	* @memberOf ch.TabNavigator
	*/
	that["public"].children = that.children;
	/**
	* Select a specific child.
	* @public
	* @function
	* @name select
	* @param {Number} tab Tab's index.
	* @memberOf ch.TabNavigator
	*/
	that["public"].select = function(tab){
		select(tab);
		
		return that["public"];
	};
	/**
	* Returns the selected child's index.
	* @public
	* @function
	* @name getSelected
	* @returns {Number} selected Tab's index.
	* @memberOf ch.TabNavigator
	*/	
	that["public"].getSelected = function(){ return (selected + 1); };

/**
*	Default event delegation
*/	

	that.$element.addClass("ch-tabNavigator");

	createTabs();

	//Default: Load hash tab or Open first tab	
	for(var i = that.children.length; i--; ){
		if ( that.children[i].$content.attr("id") === hash ) {
			select(i + 1);
			
			hashed = true;
			
			break;
		};
	};

	return that;
	
};



/**
* Simple unit of content for TabNavigators.
* @abstract
* @name Tab
* @class Tab
* @augments ch.Navs
* @memberOf ch
* @param {Configuration Object} conf Object with configuration properties
* @returns {Chico-UI Object}
*/

ch.tab = function(conf){
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name that
	* @type {Object}
	* @memberOf ch.Tab
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
	* @name createContent
	* @function
	* @memberOf ch.Tab
	*/
	var createContent = function(){
		var href = that.element.href.split("#");
		var controller = that.$element.parents(".ch-tabNavigator");
		var content = controller.find("#" + href[1]);
		
		// If there are a tabContent...
		if ( content.length > 0 ) {
			
			return content;
		
		// If tabContent doesn't exists  	
		} else {
			/**
			* Content configuration property.
			* @public
			* @name source
			* @type {String}
			* @memberOf ch.Tab
			*/
			that.source = that.element.href;
			
			var id = (href.length == 2) ? href[1] : "ch-tab" + that.uid.replace("#","-");
			
			// Create tabContent
			return $("<div id=\"" + id + "\" class=\"ch-hide\">").appendTo( controller.children().eq(1) );
		};

	};

/**
*	Protected Members
*/
	/**
	* Reference to the trigger element.
	* @private
	* @name $trigger
	* @type {jQuery Object}
	* @memberOf ch.Tab
	*/
	that.$trigger = that.$element;

	/**
	* The component's content.
	* @private
	* @name $content
	* @type {jQuery Object}
	* @memberOf ch.Tab
	*/
	that.$content = createContent();

	/**
	* Process the show event.
	* @private
	* @function
	* @name show
	* @returns {jQuery Object}
	* @memberOf ch.Tab
	*/
	that.show = function(event){
		that.prevent(event);

		// Load my content if I'need an ajax request 
		if( ch.utils.hasOwn(that, "source") ) {
			that.content();
		};

		// Show me
		that.parent.show(event);
		
		return that;
	};
	
	/**
	* This callback is triggered when async data is loaded into component's content, when ajax content comes back.
	* @public
	* @name contentCallback
	* @returns {Chico-UI Object}
	* @memberOf ch.TabNavigator
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

	return that;
}
