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
		$('<p class="btn ch-close">x</p>').one('click', function(event) {
			that.hide(event, conf);
		}).prependTo(conf.$container);
	};

	var createCone = function(conf) {
		$('<div class="ch-cone"></div>').prependTo(conf.$container);
	};

    var createLayout = function(conf) {

        // Creo el layout del float
    	conf.$container = $('<div class="ch-' + conf.name + '"><div class="ch-'+conf.name+'-content"></div></div>').appendTo("body").hide();
    	conf.$htmlContent = conf.$container.find(".ch-"+conf.name+"-content");		
		
		conf.position = conf.position || {};
		
		conf.position.element = conf.$container;
		conf.position.hold = conf.hold || false;
		
    	getContent(conf);
    	
    	// Visual configuration
		if( conf.closeButton ) createClose(conf);
		if( conf.cone ) createCone(conf);
		if( conf.classes ) conf.$container.addClass(conf.classes);
		if( conf.hasOwnProperty("width") ) conf.$container.css("width", conf.width);
		if( conf.hasOwnProperty("height") ) conf.$container.css("height", conf.height);

		conf.$container
    		.css("z-index", ui.utils.zIndex++)
		    .fadeIn('fast', function(){ that.callbacks(conf, 'onShow'); });
		
		ui.positioner(conf.position);
		
		conf.visible = true;
    }

	// Obtener contenido y cachearlo
    var getContent = function(conf) {
    			
    	if ( conf.ajax || (conf.msg && conf.msg.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g)) ) {
			
    		that.loadContent(conf);
    	
		} else {
		
    		conf.$htmlContent
    			.html( that.loadContent(conf) )
    			.fadeIn('fast', function(){ that.callbacks(conf, 'onContentLoad'); });
    	};
    }


/**
 *  Public Members
 */
 
	that.show = function(event, conf) {
	
		if (event) that.prevent(event);
		
		if(conf.visible) return;
			
		// Show if exist, else create
		if (conf.$container) {
    		conf.$container
    		    .appendTo("body")
    			.css("z-index", ui.utils.zIndex++)
			    .fadeIn('fast', function(){ 
					that.callbacks(conf, 'onShow'); 
					conf.visible = true; 
				});
			ui.positioner(conf.position);
			return;
		}
		
		// If you reach here, create a float
        createLayout(conf); 
	};

	that.hide = function(event, conf) {
	
		if (event) that.prevent(event);
		
		if (!conf.visible) return;
		
		conf.$container.fadeOut('fast', function(event){ $(this).detach(); });	
		
		// Hide
		conf.visible = false;

		that.callbacks(conf, 'onHide');
	};
	
	that.position = function(o, conf){
		
		switch(typeof o) {
		 
			case "object":
				conf.position.context = o.context || conf.position.context;
				conf.position.points = o.points || conf.position.points;
				conf.position.offset = o.offset || conf.position.offset;				
				conf.position.fixed = o.fixed || conf.position.fixed;
				
				ui.positioner(conf.position);
//				return conf.publish;
			    break;
			
			case "string":
				if(o!="refresh"){
					alert("ChicoUI error: position() expected to find \"refresh\" parameter.");
				};
				
				ui.positioner(conf.position);
//				return conf.publish;   			
			    break;
			
			case "undefined":
				return conf.position;
		        break;
		};
		
	};

	return that;
}
