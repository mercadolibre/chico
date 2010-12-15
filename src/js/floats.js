
/**
*  @static @class Floats. Represent the abstract class of all floats ui objects.
*  @requires ui.object
*  @returns {Object} New Floats.
*/
ui.floats = function(){
	var that = ui.object(); // Inheritance	
    
	var clearTimers = function(){
		clearTimeout(st);
		clearTimeout(ht);
	};

	var createClose = function(conf){
		$('<p class="btn close">x</p>').bind('click', function(event){
			that.hide(event, conf);
		}).prependTo(conf.$htmlContent);
	};

	var createCone = function(conf){
		$('<div class="cone' + ((conf.align) ? ' ' + conf.align : '')  + '"></div>').prependTo(conf.$htmlContent);
	};

	that.show = function(event, conf){
		that.prevent(event);
		
		if(conf.visible) return		
		
		conf.$htmlContent = $('<div class="ui-' + conf.name + '">');
		conf.$htmlContent
			.html(that.loadContent(conf))
			.hide()
			.css('z-index', ui.utils.zIndex++)
			.appendTo('body');

		// Visual configuration
		if(conf.closeButton) createClose(conf);
		if(conf.cone) createCone(conf);
		if(conf.classes) conf.$htmlContent.addClass(conf.classes);	
		
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

	return that;
}
