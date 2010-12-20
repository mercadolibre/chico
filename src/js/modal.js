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
	conf.position = {
		fixed:true
	};
	conf.publish = that.publish;
			
	
	// Methods Privates
	var show = function(event){
		dimmer.on();
		that.show(event, conf);
		$('.ui-modal .btn.close, .closeModal').bind('click', hide);
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
		
		// return publish object
		return conf.publish;
	}

	// Dimmer
	var dimmer = {
		on:function(){
			$('<div>').bind('click', hide).addClass('ui-dimmer').css({height:$(window).height(), display:'block', zIndex:ui.utils.zIndex++}).hide().appendTo('body').fadeIn();
			/*ui.positioner({
				element: $('.ui-dimmer'),
				fixed: true,
				points: 'lt lt'
			});*/
			//$('.ui-dimmer').fadeIn();
		},
		off:function(){
			$('div.ui-dimmer').fadeOut('normal', function(){ $(this).remove(); });
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
        conf.publish.content = (conf.content) ? conf.content : ((conf.ajax === true) ? (conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action')) : conf.ajax),
        conf.publish.show = function(event){ return show(event) },
        conf.publish.hide = function(event){ return hide(event) },
        conf.publish.position = function(event){return position(event) }

	return conf.publish;

};
