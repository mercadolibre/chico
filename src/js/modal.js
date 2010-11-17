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
	
	conf.ajaxType = 'POST';
	conf.ajaxParams = [];
	conf.ajaxParams.push({'x':'x'});//TODO refactor con el header de ajax
			
	
	// Methods Privates
	var show = function(event){			
		conf.content.data = conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action'); //Se pisaba esta variable porque tiene el mismo class pero content.data diferente. Ejmplo del Type param con contenido distintos pero la misma class (va a traer la del primero)
		if(conf.content.type.toLowerCase() === 'ajax' && conf.$trigger.attr('type') == 'submit') setAjaxConfig();
		dimmer.on();
		that.show(event, conf);
		$('.close').bind('click', hide);
	};
	
	var hide = function(event){
		dimmer.off();
		that.hide(event, conf);
	};
	
	var setAjaxConfig = function(){
		// Content from href/action						
		if(conf.content.data == '') alert('UI: Modal ajax configuration error.'); //TODO mejorar la expresion de vacio
		conf.ajaxType = conf.$trigger.parents('form').attr('method');
		conf.ajaxParams.push(conf.$trigger.parents('form').serializeArray());
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