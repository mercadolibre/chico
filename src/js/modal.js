/**
 *	Modal window
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.Modal = function(conf){
	var that = ui.Floats(); // Inheritance
	
	// Global configuration
	conf.$trigger = $(conf.element);
	conf.closeButton = true;
	conf.align = 'center';
	conf.classes = 'box';
	
	// Private
	var show = function(event){
		dimmer.on();
		that.show(event, conf);
		$('.close').bind('click', dimmer.off);
	}
	
	var hide = function(){ 
		dimmer.off();
		that.hide($.Event(), conf);
	}
	
	/*var setUrl = function(uri){
		conf.content.data = uri;
	};*/

	// Dimmer
	var dimmer = {
		on:function(){
			$('<div>').bind('click', function(event){ hide($.Event()) }).addClass('dimmer').css({height:$(window).height(), display:'block'}).hide().appendTo('body').fadeIn();
		},
		off:function(){
			$('div.dimmer').fadeOut('normal', function(){ $(this).remove(); });
		}
	};

	// Content from href/action
	if(conf.content.type.toLowerCase() === 'ajax' && !conf.content.data) conf.content.data = conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action'); 	
	
	// Events
	conf.$trigger
		.css('cursor', 'pointer')
		.bind('click', show);
		

	return { show: function(){ show($.Event()) }, hide: hide, /*setUrl: function(uri){ setUrl(uri) }*/ };
};