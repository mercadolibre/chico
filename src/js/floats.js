
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
		var className = 'ui-' + conf.name;
		
		if(conf.wrappeable){		
			conf.$trigger.addClass(className + '-trigger');
			conf.$htmlContent = $('<div class="' + className + '-content">');
			conf.$trigger.wrap( $('<div class="' + className + '">') );
			conf.$wrapper = conf.$trigger.parent();
			conf.$wrapper.css({
				display: 'inline-block',
				position: 'relative',
				/* jQuery don't support css shorthands on .css()*/
				marginTop: conf.$trigger.css('marginTop'),
				marginRight: conf.$trigger.css('marginRight'),
				marginLeft: conf.$trigger.css('marginLeft'),
				marginBottom: conf.$trigger.css('marginBottom'),				
				paddingTop: conf.$trigger.css('paddingTop'),
				paddingRight: conf.$trigger.css('paddingRight'),
				paddingLeft: conf.$trigger.css('paddingLeft'),
				paddingBottom: conf.$trigger.css('paddingBottom')
			});			
			conf.$htmlContent.html(that.loadContent(conf)).hide().appendTo( conf.$wrapper );
		}else{
			conf.$htmlContent = $('<div class="' + className + '">');
			conf.$htmlContent.html(that.loadContent(conf)).hide().appendTo('body');
		};

		// Visual configuration
		if(conf.closeButton) createClose(conf);
		if(conf.cone) createCone(conf);
		if(conf.align) ui.position[conf.align](conf);
		if(conf.classes) conf.$htmlContent.addClass(conf.classes);			
		
		// Show
		conf.visible = true;
		conf.$htmlContent.fadeIn('fast', function(){ that.callbacks(conf, 'show'); });			
	};

	that.hide = function(event, conf){
		that.prevent(event);
		
		if(!conf.visible) return;
		
		var className = 'ui-' + conf.name;
		
		if(conf.wrappeable){				
			conf.$wrapper.find('.' + className + '-trigger').removeClass(className + '-trigger');
			conf.$wrapper.find('.' + className + '-content').unwrap().remove();
		}else{
			$('.' + className).fadeOut('fast', function(event){ $(this).remove(); });	
		};
		
		// Hide
		conf.visible = false;
		that.callbacks(conf, 'hide');
	};

	return that;
}
