
/**
*  @static @class Floats. Represent the abstract class of all floats ui objects.
*  @requires PowerConstructor
*	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
*	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
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
		//TODO: clearTimers();
		conf.$htmlContent = $('<div>').addClass('ui' + ui.utils.ucfirst(conf.name));
		conf.$htmlContent.html(that.loadContent(conf)).hide().appendTo('body');

		// Visual configuration
		if(conf.closeButton) createClose(conf);
		if(conf.cone) createCone(conf);
		if(conf.align) ui.positionator[conf.align](conf);
		if(conf.classes) conf.$htmlContent.addClass(conf.classes);

		conf.$htmlContent.fadeIn('fast', function(){ that.callbacks(conf, 'show'); });
	};

	that.hide = function(event, conf){
		that.prevent(event);
		//TODO: clearTimers();
		$('.ui' + ui.utils.ucfirst(conf.name)).fadeOut('fast', function(event){ $(this).remove(); });
		that.callbacks(conf, 'hide');
	};

	return that;
}