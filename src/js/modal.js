/**
 *	Modal window
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.modal = function(conf){
	var that = ui.floats(); // Inheritance
	
	// Global configuration
	conf.$trigger = $(conf.element);
	conf.closeButton = true;
	conf.classes = 'box';
	conf.ajaxType = 'POST';
	conf.position = {
		fixed:true
	};
	conf.publish = that.publish;
			
	
	// Methods Privates
	var show = function(event){
		if(conf.content.type.toLowerCase() === 'ajax'){
			conf.content.data = conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action'); //Se pisaba esta variable porque tiene el mismo class pero content.data diferente. Ejmplo del Type param con contenido distintos pero la misma class (va a traer la del primero)
			conf.ajaxParams = 'x=x';//TODO refactor con el header de ajax
			if(conf.$trigger.attr('type') == 'submit') setAjaxConfig();						
		};
		dimmer.on();
		that.show(event, conf);
		$('.ch-modal .btn.close, .closeModal').bind('click', hide);
		conf.$trigger.blur();
        
        // return publish object
        return conf.publish;        
	};

	var hide = function(event){
		dimmer.off();
		that.hide(event, conf);

        // return publish object
        return conf.publish;
	};
	
	var position = function(event){
		ui.positioner(conf.position);
		
		return conf.publish;
	}

	var setAjaxConfig = function(){
		// Content from href/action						
		if(conf.content.data == '') alert('UI: Modal ajax configuration error.'); //TODO mejorar la expresion de vacio
		conf.ajaxType = conf.$trigger.parents('form').attr('method') || 'POST';
		var serialized = conf.$trigger.parents('form').serialize();
		conf.ajaxParams = conf.ajaxParams + ((serialized != '') ? '&' + serialized : '');
	};

	// Dimmer
	var dimmer = {
		on:function(){
			$('<div>').bind('click', hide).addClass('ch-dimmer').css({height:$(window).height(), display:'block', zIndex:ui.utils.zIndex++}).hide().appendTo('body').fadeIn();
			/*ui.positioner({
				element: $('.ch-dimmer'),
				fixed: true,
				points: 'lt lt'
			});*/
			//$('.ch-dimmer').fadeIn();
		},
		off:function(){
			$('div.ch-dimmer').fadeOut('normal', function(){ $(this).remove(); });
		}
	};
	

	// Events
	conf.$trigger
		.css('cursor', 'pointer')
		.bind('click', show);
		
        // create the publish object to be returned
        conf.publish.uid = conf.id,
        conf.publish.element = conf.element,
        conf.publish.type = "ui.modal",
        conf.publish.content = conf.content.data,
        conf.publish.show = function(event){ return show(event) },
        conf.publish.hide = function(event){ return hide(event) },
        conf.publish.position = function(event){return position(event) }

	return conf.publish;

};
