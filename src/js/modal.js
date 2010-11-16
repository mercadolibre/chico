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
	
	// Methods Privates
	var show = function(event){		
		if(conf.content.type.toLowerCase() === 'ajax') setAjaxConfig();
		dimmer.on();
		that.show(event, conf);
		$('.close').bind('click', dimmer.off);
	};
	
	var hide = function(event){ 
		dimmer.off();
		that.hide(event, conf);
	};
	
	var setAjaxConfig = function(){
		// Content from href/action
		if(!conf.content.data) conf.content.data = conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action');
		if(conf.content.data == '') alert('UI: Modal ajax configuration error.'); //TODO mejorar la expresion de vacio
		
		// Form method and serialize
		if(conf.$trigger.attr('type') == 'submit'){
			conf.ajaxType = conf.$trigger.parents('form').attr('method') || 'POST';
			conf.ajaxParams = conf.$trigger.parents('form').serializeArray() || [];
			conf.ajaxParams.push({'x':'x'});//TODO refactor con el header de ajax 
		};
	};
	
	// Dimmer
	var dimmer = {
		on:function(){
			$('<div>').bind('click', function(event){ hide(event) }).addClass('dimmer').css({height:$(window).height(), display:'block'}).hide().appendTo('body').fadeIn();
		},
		off:function(){
			$('div.dimmer').fadeOut('normal', function(){ $(this).remove(); });
		}
	};
	

	// Events
	conf.$trigger
		.css('cursor', 'pointer')
		.bind('click', function(event){ show(event) });
		

	return { show: function(){ show($.Event()) }, hide: function(){ hide($.Event()) } };
};