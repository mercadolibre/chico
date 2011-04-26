/**
 *	Tabs Navigator
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.tabNavigator = function(conf){

/** 
 *  Constructor
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
	
	var ul = that.$element.children(':first').addClass('ch-tabNavigator-triggers');
	
	var hash = window.location.hash.replace("#!", "");
	
    var hashed = false;
    
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
	
	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].children = that.children;
	that["public"].select = function(tab){
		that.select(tab);
		
		return that["public"];
	};	
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
 *	Tab
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ch.tab = function(controller){

/** 
 *  Constructor
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
	
	that.$trigger = that.$element.addClass("ch-tabNavigator-trigger");
	
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
				.attr("id", "ch-tab" + that.uid)
				.addClass("ch-hide")
				.appendTo( controller.$content );
		}; 

	})();
	
	// Process show event
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
