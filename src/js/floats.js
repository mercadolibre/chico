/**
 *  @class Floats. Represent the abstract class of all floats UI-Objects.
 *  @requires object.
 *  @returns {Object} Floats.
 */

ui.floats = function(conf) {

/**
 *  Constructor
 */

/**
 *  Inheritance
 */

	var that = ui.object(conf); // Inheritance	
    
/**
 *  Private Members
 */
	var createClose = function(conf) {
		$('<p class="btn ch-close">x</p>').bind('click', function(event) {
			that.hide(event, conf);
		}).prependTo(conf.$container);
	};

	var createCone = function(conf) {
		$('<div class="ch-cone"></div>').prependTo(conf.$container);
	};

    var createLayout = function(conf) {

        // Creo el layout del float
    	conf.$container = $("<div class=\"ch-" + conf.type + "\"><div class=\"ch-" + conf.type + "-content\"></div></div>").appendTo("body").hide();
    	conf.$htmlContent = conf.$container.find(".ch-" + conf.type + "-content");
		
		conf.position = conf.position || {};
		conf.position.element = conf.$container;
		conf.position.hold = conf.hold || false;		
		conf.cache = ( conf.hasOwnProperty("cache") ) ? conf.cache : true;
    	
    	// Visual configuration
		if( conf.closeButton ) createClose(conf);
		if( conf.cone ) createCone(conf);
		if( conf.classes ) conf.$container.addClass(conf.classes);
		if( conf.hasOwnProperty("width") ) conf.$container.css("width", conf.width);
		if( conf.hasOwnProperty("height") ) conf.$container.css("height", conf.height);

		conf.$htmlContent.html( that.loadContent(conf) );
		conf.$container
    		.css("z-index", ui.utils.zIndex++)
		    .fadeIn('fast', function(){ that.callbacks(conf, 'onShow'); });

		ui.positioner(conf.position);
		
		conf.visible = true;
    };

/**
 *  Public Members
 */
 
	that.show = function(event, conf) {
	
		if ( event ) that.prevent(event);
		
		if ( conf.visible ) return;
		
		// Show if exist, else create		
		if ( conf.$container ) {
			
			// If not cache... get content! 
			if ( !conf.cache ) conf.$htmlContent.html( that.loadContent(conf) );
						
    		conf.$container
    		    .appendTo("body")
    			.css("z-index", ui.utils.zIndex++)
			    .fadeIn('fast', function(){ 
					conf.visible = true;
					
					// Callback execute
					that.callbacks(conf, 'onShow');
				});

			ui.positioner(conf.position);			
			return;
		};
		
		// If you reach here, create a float
        createLayout(conf); 
	};

	that.hide = function(event, conf) {
	
		if (event) that.prevent(event);
		
		if (!conf.visible) return;
		
		conf.$container.fadeOut('fast', function(event){ 
			$(this).detach(); 
			conf.visible = false;
			
			// Callback execute
			that.callbacks(conf, 'onHide');	
		});

	};
		
	return that;
};
