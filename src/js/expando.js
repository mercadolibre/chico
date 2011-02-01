/**
 *	Expando
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.expando = function(conf){
	var that = ui.navs(); // Inheritance

	// Global configuration
	$(conf.element).children(':first').wrapInner("<span class=\"ch-expando-trigger\"></span>");
	$(conf.element).addClass('ch-expando');		
	conf.$trigger = $(conf.element).find(".ch-expando-trigger");
	conf.$htmlContent = conf.$trigger.parent().next();
    conf.open = conf.open || false;
	
	// Private methods
	var show = function(event){
		// Toggle
		if(that.status){
			return hide();
		};	
		// Show
        that.show(event, conf);
        return conf.publish; // Returns publish object
    };
	
    var hide = function(event){
    	// Hide
		that.hide(event, conf); 
		return conf.publish; // Returns publish object
    };
    
	// Trigger
	conf.$trigger
		.bind('click', function(event){
			// Show menu
			that.prevent(event);
			show();
		})
		.addClass('ch-expando-trigger')
		
	// Content
	conf.$htmlContent
		.bind('click', function(event){ event.stopPropagation() })		
		.addClass('ch-expando-content');

	
	// Change default behaivor (close)
	if( conf.open ) show();
	
    
    // Create the publish object to be returned
    conf.publish = that.publish;
    
    /**
	 *  @ Public Properties
	 */
    conf.publish.uid = conf.uid;
    conf.publish.element = conf.element;
	conf.publish.type = conf.type;
    conf.publish.open = conf.open;
    
    /**
	 *  @ Public Methods
	 */
    conf.publish.show = function(){ return show() };
    conf.publish.hide = function(){ return hide() };

	return conf.publish;

};
