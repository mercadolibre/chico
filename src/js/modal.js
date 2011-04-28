/**
 *	@class Modal. Create and manage modal windows
 *  @requires: floats.
 *	@return Public Object.
 */

ch.modal = function(conf){

/**
 *	Constructor
 *	Guardo el contexto de ejecucion (this) que viene con 3 propiedades del factory (uid, element, type).
 *	Luego, seteamos la configuracion básica del componente y lo guardamos en el contexto para que llegue a sus padres cuando pasamos el contexto (that.conf).
 */

	var that = this;

	conf = ch.clon(conf);
	conf.ajax = ( !conf.hasOwnProperty("ajax") && !conf.hasOwnProperty("content") && !conf.hasOwnProperty("msg") ) ? true : conf.ajax; //Default	
	conf.closeButton = (that.type == "modal") ? true : false;
	conf.classes = "box";

	that.conf = conf;

/**
 *	Inheritance
 */

    that = ch.floats.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

	// Dimmer object
	var $dimmer = $("<div>").addClass("ch-dimmer");
	
	// Set dimmer height for IE6
	if (ch.utils.html.hasClass("ie6")) { $dimmer.height( parseInt(document.documentElement.clientHeight, 10) * 3) };
	
	// Dimmer Controller
	var dimmer = {
		on: function() { //TODO: posicionar el dimmer con el positioner
			$dimmer
				.appendTo("body")
				.css("z-index", ch.utils.zIndex ++)
				.fadeIn();
		
			if (that.type == "modal") {
				$dimmer.one("click", function(event){ that.hide(event) });
			};
			
			if (!ch.features.fixed) {
			  	ch.positioner({ element: $dimmer });
			};
		},
		off: function() {
			$dimmer.fadeOut("normal", function(){ 
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
		that.parent.hide(event);

		return that;
	};
	
/**
 *  Public Members
 */
   	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;
	that["public"].content = that.content;
	
	that["public"].show = function(){
		that.show();
		
		return that["public"];
	};
	
	that["public"].hide = function(){
		that.hide();
		
		return that["public"];
	};
	
	that["public"].position = that.position;
 
/**
 *  Default event delegation
 */	
	that.$trigger
		.css("cursor", "pointer")
		.bind("click", function(event){ that.show(event); });

	return that;
};



/**
 *	@Interface Transition
 *	@return An interface object
 */
 
ch.transition = function(conf) {
    
    conf = conf || {};
	
	conf.closeButton = false;
	conf.msg = conf.msg || "Please wait...";
	conf.content = $("<div>")
		.addClass("loading")
		.append( $("<p>").html(conf.msg) );

	return ch.modal.call(this, conf);
    
}

ch.factory({ component: 'transition' });
