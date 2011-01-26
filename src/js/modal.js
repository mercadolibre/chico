/**
 *	@class Modal. Create and manage modal windows
 *  @requires: floats.
 *	@return Public Object.
 */

ui.modal = function(conf){

/**
 *  Constructor
 */
	conf.$trigger = $(conf.element);
	conf.closeButton = true;
	conf.classes = 'box';
	conf.position = {
		fixed:true
	};
	conf.ajax = ( !conf.hasOwnProperty("ajax") && !conf.hasOwnProperty("content") && !conf.hasOwnProperty("msg") ) ? true : undefined ; //Default	

/**
 *  Inheritance
 */

	var that = ui.floats(conf); // Inheritance	

/**
 *  Private Members
 */

	var dimmer = {
		on: function() { //TODO: posicionar el dimmer con el positioner
			$('<div>').bind('click', hide).addClass('ch-dimmer').css({height:$(window).height(), display:'block', zIndex:ui.utils.zIndex++}).hide().appendTo('body').fadeIn();
		},
		off: function() {
			$('div.ch-dimmer').fadeOut('normal', function(){ $(this).remove(); });
		}
	};

	var show = function(event) {
		dimmer.on();
		that.show(event, conf);
		ui.positioner(conf.position);
		$('.ch-modal .btn.ch-close, .closeModal').bind('click', hide);
		conf.$trigger.blur();
	};

	var hide = function(event) {
		dimmer.off();
		that.hide(event, conf);
	};

	
/**
 *  Protected Members
 */ 
 
/**
 *  Default event delegation
 */	
	conf.$trigger
		.css('cursor', 'pointer')
		.bind('click', show);

/**
 *  Expose propierties and methods
 */	
	that.publish = {
	
	/**
	 *  @ Public Properties
	 */
    	uid: conf.id,
		element: conf.element,
		type: "modal",
		content: (conf.content) ? conf.content : ((conf.ajax === true) ? (conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action')) : conf.ajax ),
	/**
	 *  @ Public Methods
	 */
	 	show: function() {
			show();
			return that.publish;
		},
		hide: function() {
			hide();
			return that.publish;
		},
		position: function(o) {
			return that.position(o,conf) || that.publish;
		}
	};
	
	return that.publish;
};
