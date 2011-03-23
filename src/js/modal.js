/**
 *	@class Modal. Create and manage modal windows
 *  @requires: floats.
 *	@return Public Object.
 */

ui.modal = function(conf){

/**
 *	Constructor
 *	Guardo el contexto de ejecucion (this) que viene con 3 propiedades del factory (uid, element, type).
 *	Luego, seteamos la configuracion básica del componente y lo guardamos en el contexto para que llegue a sus padres cuando pasamos el contexto (that.conf).
 */

	var that = this;

	conf = ui.clon(conf);
	conf.ajax = ( !conf.hasOwnProperty("ajax") && !conf.hasOwnProperty("content") && !conf.hasOwnProperty("msg") ) ? true : conf.ajax; //Default	
	conf.closeButton = (that.type == "modal") ? true : false;
	conf.classes = "box";

	that.conf = conf;

/**
 *	Inheritance
 */

    that = ui.floats.call(that);
    that.parent = ui.clon(that);

/**
 *  Private Members
 */

	// Dimmer 2.0
	// Dimmer object
	var $dimmer = $('<div>')
			.addClass('ch-dimmer')
			.css({ height: ui.utils.window.height(), display:'block' })
			.hide();

	// Dimmer Controller
	var dimmer = {
		on: function() { //TODO: posicionar el dimmer con el positioner
			$dimmer
				.appendTo('body')
				.css("z-index",ui.utils.zIndex++)
				.fadeIn();

			if (that.type == "modal") {
				$dimmer.one("click", function(event){ that.hide(event) });
			}
			
		},
		off: function() {
			$dimmer.fadeOut('normal', function(){ 
				$dimmer.detach(); 
			});
		}
	};

/**
 *  Protected Members
 */ 
	that.$trigger = that.$element;
	
	that.show = function(event) {	
		dimmer.on();
		that.parent.show(event);		
		that.$trigger.blur();
		
		return that;
	};
	
	that.hide = function(event) {
		dimmer.off();

		// If not cache, return content to body
		if ( conf.cache == false && $(conf.content).length > 0 ) {
			that.$content.children().appendTo("body").fadeOut();
		};
		
		that.parent.hide(event);

		return that;
	};
	
/**
 *  Public Members
 */
   	that.public.uid = that.uid;
	that.public.element = that.element;
	that.public.type = that.type;
	that.public.content = (conf.content) ? conf.content : ((conf.ajax === true) ? (that.$trigger.attr('href') || that.$trigger.parents('form').attr('action')) : conf.ajax );
	that.public.show = function(){
		that.show();
		
		return that.public;
	};
	
	that.public.hide = function(){
		that.hide();
		
		return that.public;
	};
	
	that.public.position = that.position;
 
/**
 *  Default event delegation
 */	
	that.$trigger
		.css('cursor', 'pointer')
		.bind('click', function(event){ that.show(event) });

	return that;
};



/**
 *	@Interface Transition
 *	@return An interface object
 

var t = $("div").transition("Aguarde mientras transiosiono");
	t.hide();
 
 */
 
ui.transition = function(conf) {
    
    conf = conf || {};
	
	conf.closeButton = false;
	conf.msg = conf.msg || "Espere por favor...";
	conf.content = "<div class=\"loading\"></div><p>"+conf.msg+"</p>";

	return ui.modal.call(this, conf);
    
}

ui.factory({ component: 'transition' });
