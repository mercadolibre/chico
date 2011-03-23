/**
 *  @class Floats. Represent the abstract class of all floats UI-Objects.
 *  @requires object.
 *  @returns {Object} Floats.
 */

ui.floats = function() {

/**
 *  Constructor
 */
	var that = this;
	var conf = that.conf;	
	
/**
 *  Inheritance
 */

    that = ui.object.call(that);
    that.parent = ui.clon(that);
    
/**
 *  Private Members
 */
	var createCone = function() {
		$('<div class="ch-cone"></div>').prependTo(that.$container);
		
		return;
	};

	var createClose = function() { 
		$('<p>')
			.addClass("btn ch-close")
			.css("z-index",ui.utils.zIndex++)
			.bind('click', function(event){ that.hide(event) })
			.prependTo(that.$container);
			
		return;
	};

    var createLayout = function() {
		
        // Creo el layout del float
    	that.$container = $("<div class=\"ch-" + that.type + "\"><div class=\"ch-" + that.type + "-content\"></div></div>").appendTo("body").hide();
    	that.$content = that.$container.find(".ch-" + that.type + "-content");

		conf.position = conf.position || {};
		conf.position.element = that.$container;
		conf.position.hold = conf.hold || false;
		
		conf.cache = ( conf.hasOwnProperty("cache") ) ? conf.cache : true;
    	
    	// Visual configuration
		if( conf.closeButton ) createClose();
		if( conf.cone ) createCone();
		if( conf.classes ) that.$container.addClass(conf.classes);
		if( conf.hasOwnProperty("width") ) that.$container.css("width", conf.width);
		if( conf.hasOwnProperty("height") ) that.$container.css("height", conf.height);

		that.$content.html( that.loadContent(that) );
		that.$container
    		.css("z-index", ui.utils.zIndex++)
		    .fadeIn('fast', function(){ that.callbacks('onShow'); });

		ui.positioner.call(that);
		
		return;
    };
    

/**
 *  Protected Members
 */ 
			
/**
 *  Public Members
 */
 
	that.active = false;
	
	that.show = function(event) {
		
		if ( event ) that.prevent(event);
		
		if ( that.active ) return;
		
		that.active = true;
		
		// Show if exist, else create		
		if ( that.$container ) {
			
			// If not cache... get content! // Flush cache where?? when?? do it!
			if ( !conf.cache ) that.$content.html( that.loadContent() );
						
    		that.$container
    		    .appendTo("body")
    			.css("z-index", ui.utils.zIndex++)
			    .fadeIn('fast', function(){ 
					that.active = true;
					
					// Callback execute
					that.callbacks('onShow');
				});

			that.position("refresh");
						
			return that;
		};
		
		// If you reach here, create a float
        createLayout();
        
        return that;
	};

	that.hide = function(event) {

		if (event) that.prevent(event);

		if (!that.active) return;

		that.$container.fadeOut('fast', function(){ 
			 
			that.active = false;
			
			// Callback execute
			that.callbacks('onHide');
			
			$(this).detach();
		});
		
		return that;

	};
	
	return that;
	
};