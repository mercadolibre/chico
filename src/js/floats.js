/**
 *  @class Floats. Represent the abstract class of all floats UI-Objects.
 *  @requires object.
 *  @returns {Object} Floats.
 */
/*

callbacks:{
	show:,
	hide:,
	contentLoad:,
	contentError:
}
	
*/ 
ui.floats = function() {
    
	var that = ui.object(); // Inheritance	

	var createClose = function(conf) {
		$('<p class="btn ch-close">x</p>').bind('click', function(event) {
			that.hide(event, conf);
		}).prependTo(conf.$htmlContentainer);
	};

	var createCone = function(conf) {
		$('<div class="ch-cone"></div>').prependTo(conf.$htmlContentainer);
	};

	that.show = function(event, conf) {
		that.prevent(event);
		
		if(conf.visible) return;
		
		conf.$htmlContentainer = $('<div class="ch-' + conf.name + '"><div class="ch-'+conf.name+'-content"></div></div>');
		conf.$htmlContent = conf.$htmlContentainer.find(".ch-"+conf.name+"-content");
		
	
		// Visual configuration
		if( conf.closeButton ) createClose(conf);
		if( conf.cone ) createCone(conf);
		if( conf.classes ) conf.$htmlContentainer.addClass(conf.classes);
		if( conf.hasOwnProperty("width") ) conf.$htmlContentainer.css("width", conf.width);
		if( conf.hasOwnProperty("height") ) conf.$htmlContentainer.css("height", conf.height);
		
		// Show
		conf.$htmlContentainer
			.hide()
			.css("z-index", ui.utils.zIndex++)
			.appendTo("body")
			.fadeIn('fast', function(){ that.callbacks(conf, 'show'); });

		//Load content
		if( conf.ajax || (conf.msg && conf.msg.match(/(?:(?:(https?|file):\/\/)([^\/]+)(\/(?:[^\s])+)?)|(\/(?:[^\s])+)/g)) ){
			that.loadContent(conf);
		}else{
			conf.$htmlContent
				.html( that.loadContent(conf) )
				.fadeIn('fast', function(){ that.callbacks(conf, 'contentLoad'); });
		};
		
		conf.visible = true;
				
		// Positioner
		conf.position.element = conf.$htmlContentainer;
		ui.positioner(conf.position);

	};

	that.hide = function(event, conf){
		that.prevent(event);
		
		if(!conf.visible) return;
		
		conf.$htmlContentainer.fadeOut('fast', function(event){ $(this).remove(); });	
		
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
