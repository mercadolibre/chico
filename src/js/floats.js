
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
	var visible = false;

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
		
		if(!visible) { //fucking bug on IE and Opera with .wrap()
			var className = 'ui' + ui.utils.ucfirst(conf.name);
			if(conf.wrappeable){
				$('.' + className + ' .uiContent').unwrap().remove();				
				conf.$trigger.wrap( $('<div class="' + className + '">') );
				conf.$wrapper = conf.$trigger.parent();
				conf.$trigger.addClass('uiTrigger');
				conf.$htmlContent = $('<div class="uiContent">');				
				conf.$htmlContent.html(that.loadContent(conf)).hide().appendTo('.' + className);
				conf.$wrapper.css({height: parseInt(conf.$trigger.outerHeight()),width: parseInt(conf.$trigger.outerWidth())});				
			}else{
				conf.$htmlContent = $('<div class="' + className + '">');
				conf.$htmlContent.html(that.loadContent(conf)).hide().appendTo('body');
			};
			

			// Visual configuration
			if(conf.closeButton) createClose(conf);
			if(conf.cone) createCone(conf);
			if(conf.align) ui.position[conf.align](conf);
			if(conf.classes) conf.$htmlContent.addClass(conf.classes);			
			conf.$htmlContent.fadeIn('fast', function(){ that.callbacks(conf, 'show'); });			
			visible = true;
		};

	};

	that.hide = function(event, conf){
		that.prevent(event);
		//TODO: clearTimers();		
		if( visible ){ //fucking bug on IE and Opera with .wrap()
			var className = 'ui' + ui.utils.ucfirst(conf.name);
			if(conf.wrappeable){				
				conf.$wrapper.find('.uiTrigger').removeClass('uiTrigger');
				conf.$wrapper.find('.uiContent').unwrap().remove();
			}else{
				$('.' + className).fadeOut('fast', function(event){ $(this).remove(); });	
			};			
			that.callbacks(conf, 'hide');			
			visible = false;
		};
	};

	return that;
}