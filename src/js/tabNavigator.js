
/**
 * TabNavigator UI-Component for static and dinamic content.
 * @name TabNavigator
 * @class TabNavigator
 * @augments ch.Controllers
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
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

	that.$element.addClass('ch-tabNavigator');
		
	conf = ch.clon(conf);
	conf.selected = conf.selected || conf.value || 0;
	
	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

    /**
     * Reference to the tabNavigator's triggers.
     * @private
     * @name ul
     * @type {jQuery Object}
     * @memberOf ch.TabNavigator
     */
	var ul = that.$element.children(':first').addClass('ch-tabNavigator-triggers');
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
    var selected = conf.selected;

/**
 *  Protected Members
 */ 
 
 	that.$trigger = ul.find('a');
	that.$content = ul.next().addClass('ch-tabNavigator-content box');
	
	that.select = function(tab){		
		
		selected = parseInt(tab);
		
		tab = that.children[selected];
		
		if(tab.active) return; // Don't click me if I'm open

		// Hide my open bro
		$.each(that.children, function(i, e){
			if( e.active ) e.hide();
		});
        
        tab.shoot();
        
        //Change location hash
		window.location.hash = "#!" + tab.$content.attr("id");		
		
		// Callback
		that.callbacks("onSelect");
		
        return that;
	};
    
/**
 *  Public Members
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
		that.select(tab);
		
		return that["public"];
	};
    /**
     * Returns the selected child's index.
     * @public
     * @function
     * @name getSelected
     * @return {Number} selected Tab's index.
     * @memberOf ch.TabNavigator
     */	
	that["public"].getSelected = function(){ return selected; };
	
/**
 *  Default event delegation
 */	
    
	// Create children
	$.each(that.$trigger, function(i, e){
		var tab = {};
			tab.uid = that.uid + "#" + i;
			tab.type = "tab";
			tab.element = e;
			tab.$element = $(e);
			
		that.children.push( ch.tab.call(tab, that) );
	});
	
	//Default: Load hash tab or Open first tab	
	for(var i = that.children.length; i--; ){
		if ( that.children[i].$content.attr("id") === hash ) {
			that.select(i);
			
			hashed = true;
			
			break;
		};
	};

	if ( !hashed ) that.children[conf.selected].shoot();

	return that;
	
};



/**
 * Simple unit of content for TabNavigators.
 * @name Tab
 * @class Tab
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */

ch.tab = function(controller){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Tab
     */
 	var that = this;
	
	conf = {};
	if ( controller.conf.hasOwnProperty("onContentLoad") ) conf.onContentLoad = controller.conf.onContentLoad;
	if ( controller.conf.hasOwnProperty("onContentError") ) conf.onContentError = controller.conf.onContentError;	
	
	that.conf = conf;
/**
 *	Inheritance
 */

    that = ch.navs.call(that);
    that.parent = ch.clon(that);
	that.controller = controller;

/**
 *  Private Members
 */
	
	
/**
 *  Protected Members
 */ 
    /**
     * Reference to the trigger element.
     * @private
     * @name $trigger
     * @type {jQuery Object}
     * @memberOf ch.Tab
     */
	that.$trigger = that.$element.addClass("ch-tabNavigator-trigger");

    /**
     * The component's content.
     * @private
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.Tab
     */	
	that.$content = (function(){
		
		var content = controller.$element.find("#" + that.element.href.split("#")[1]);
		
		// If there are a tabContent...
		if ( content.length > 0 ) {
			
			return content;
		
		// If tabContent doesn't exists        
		} else {
			// Set ajax configuration
			conf.ajax = true;

			// Create tabContent
			return $("<div>")
				.attr("id", (that.element.href.split("#").length == 2) ? that.element.href.split("#")[1] : "ch-tab" + that.uid.replace("#","-") )
				.addClass("ch-hide")
				.appendTo( controller.$content );
		}; 

	})();

    /**
     * Process the show event.
     * @private
     * @function
     * @name shoot
     * @return {jQuery Object}
     * @memberOf ch.Tab
     */ 
	that.shoot = function(event){
		that.prevent(event);

		// Load my content if I'need an ajax request 
		if( that.$content.html() == "" ) that.$content.html( that.loadContent() );

		// Show me
		that.show(event);
		
		return that;
	};

/**
 *  Public Members
 */
	
	
/**
 *  Default event delegation
 */	 	
	
	// Hide my content if im inactive
	if(!that.active) that.$content.addClass("ch-hide");

	that.$trigger.bind('click', function(event){
		that.prevent(event);
		controller.select(that.uid.split("#")[1]);
	});
	
	return that;
}
