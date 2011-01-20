/**
 *  @class Floats. Represent the abstract class of all floats UI-Objects.
 *  @requires object.
 *  @returns {Object} Floats.
 */
 
ui.floats = function() {
    
	var that = ui.object(); // Inheritance	

	var createClose = function(conf) {
		$('<p class="btn ch-close">x</p>').bind('click', function(event) {
			that.hide(event, conf);
		}).prependTo(conf.$htmlContent);
	};

	var createCone = function(conf) {
		$('<div class="ch-cone"></div>').prependTo(conf.$htmlContent);
	};

	that.show = function(event, conf) {
		that.prevent(event);
		
		if(conf.visible) return;
		
		conf.$htmlContent = $('<div class="ch-' + conf.name + '">');

		conf.$htmlContent
			.hide()
			.css("z-index", ui.utils.zIndex++)
			.appendTo("body")
			.html( that.loadContent(conf) );
				
		// Visual configuration
		if( conf.closeButton ) createClose(conf);
		if( conf.cone ) createCone(conf);
		if( conf.classes ) conf.$htmlContent.addClass(conf.classes);
		if( conf.hasOwnProperty("width") ) conf.$htmlContent.css("width", conf.width);
		if( conf.hasOwnProperty("height") ) conf.$htmlContent.css("height", conf.height);
		
		// Positioner
		conf.position.element = conf.$htmlContent;
		ui.positioner(conf.position);

		// Show
		conf.visible = true;
		conf.$htmlContent.fadeIn('fast', function(){ that.callbacks(conf, 'show'); });			
	};

	that.hide = function(event, conf){
		that.prevent(event);
		
		if(!conf.visible) return;
		
		conf.$htmlContent.fadeOut('fast', function(event){ $(this).remove(); });	
		
		// Hide
		conf.visible = false;
		that.callbacks(conf, 'hide');
	};
	
	that.position = function(o, conf){
		
		switch(typeof o){
			case "object":
				conf.position.context = o.context || conf.position.context;
				conf.position.points = o.points || conf.position.points;
				conf.position.offset = o.offset || conf.position.offset;				
				conf.position.fixed = o.fixed || conf.position.fixed;
				
				ui.positioner(conf.position);
				return conf.publish;
			break;
			
			case "string":
				if(o!="refresh"){
					alert("ChicoUI error: position() expected to find \"refresh\" parameter.");
				};
				
				ui.positioner(conf.position);
				return conf.publish;   			
			break;
			
			case "undefined":
				return conf.position;
			break;
		};
		
	};

	return that;
}
