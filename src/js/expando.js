/**
 *	Expando
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.expando = function(conf){

/** 
 *  Constructor
 */
	
	var that = this;
	
	that.$element.addClass("ch-expando")
		.children(":first").wrapInner("<span class=\"ch-expando-trigger\"></span>");
		
    conf = ui.clon(conf);
    conf.open = conf.open || false;

	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ui.navs.call(that);
    that.parent = ui.clon(that);

/**
 *  Private Members
 */
	
	

/**
 *  Protected Members
 */ 

	that.$content = that.$element.children().eq(1);
	that.$trigger = that.$element.find(".ch-expando-trigger");
	
	that.show = function(event){
		that.prevent(event);
		
		// Toggle
		if ( that.active ) {
			return that.hide(event);
		};
		
		that.parent.show(event);
		
		return that;
	};

/**
 *  Public Members
 */
   	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = that.type;
	that.public.show = function(){
		that.show();
		
		return that.public;
	};
	
	that.public.hide = function(){
		that.hide();
		
		return that.public;
	};
	

/**
 *  Default event delegation
 */		
    
	// Trigger
	that.$trigger
		.bind('click', function(event){	that.show(event); })
		.addClass('ch-expando-trigger');
		
	// Content
	that.$content
		.bind('click', function(event){ event.stopPropagation() })		
		.addClass('ch-expando-content');

	
	// Change default behaivor (close)
	if( conf.open ) that.show();
	
    
    // Create the publish object to be returned
    conf.publish = that.publish;

	return that;

};
