/**
 *  @class Floats. Represent the abstract class of all floats UI-Objects.
 *  @requires object.
 *  @returns {Object} Floats.
 */
/*

that.callbacks:{
	show:,
	hide:,
	contentLoad:,
	contentError:
}	

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
		}).prependTo(conf.$htmlContentainer);
	};

	var createCone = function(conf) {
		$('<div class="ch-cone"></div>').prependTo(conf.$htmlContentainer);
	};

    var createLayout = function(conf) {

        // Creo el layout del float
    	conf.$htmlContentainer = $('<div class="ch-' + conf.name + '"><div class="ch-'+conf.name+'-content"></div></div>').appendTo("body").hide();
    	conf.$htmlContent = conf.$htmlContentainer.find(".ch-"+conf.name+"-content");		

		conf.position.element = conf.$htmlContentainer;
		ui.positioner(conf.position);
		
    	getContent(conf);
    	
    	// Visual configuration
		if( conf.closeButton ) createClose(conf);
		if( conf.cone ) createCone(conf);
		if( conf.classes ) conf.$htmlContentainer.addClass(conf.classes);
		if( conf.hasOwnProperty("width") ) conf.$htmlContentainer.css("width", conf.width);
		if( conf.hasOwnProperty("height") ) conf.$htmlContentainer.css("height", conf.height);

		conf.$htmlContentainer
    		.css("z-index", ui.utils.zIndex++)
		    .fadeIn('fast', function(){ that.callbacks(conf, 'show'); });

		conf.visible = true;
    }

// Obtener contenido y cachearlo
    var getContent = function(conf) {
	
    	if ( conf.ajax || (conf.msg && conf.msg.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g)) ) {
		
    		that.loadContent(conf);
    	
		} else {
		
    		conf.$htmlContent
    			.html( that.loadContent(conf) )
    			.fadeIn('fast', function(){ that.callbacks(conf, 'contentLoad'); });
    	};
    }


/**
 *  Public Members
 */
 
	that.show = function(event, conf) {
	
		if (event) that.prevent(event);
		
		if(conf.visible) return;
			
		// Show if exist, else create
		if (conf.$htmlContentainer) {
    		conf.$htmlContentainer
    		    .appendTo("body")
    			.css("z-index", ui.utils.zIndex++)
			    .fadeIn('fast', function(){ 
					that.callbacks(conf, 'show'); 
					conf.visible = true; 
				});

			return;
		}
		
		// If you reach here, create a float
        createLayout(conf); 
	};

	that.hide = function(event, conf) {
	
		if (event) that.prevent(event);
		
		if (!conf.visible) return;
		
		conf.$htmlContentainer.fadeOut('fast', function(event){ $(this).detach(); });	
		
		// Hide
		conf.visible = false;

		that.callbacks(conf, 'hide');
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
