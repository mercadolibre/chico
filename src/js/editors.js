
/**
*	Editor Components Constructor Pattern
*	@author
*	@Contructor
*	@return
*/	
ui.editors = function(){
	var that = ui.object(); // Inheritance
	var wrapper;
	
	that.show = function(event, conf){
		that.prevent(event);
		
		// wrapper
		conf.$trigger.wrap( $('<div class="' + conf.classes + '">') );
		wrapper = conf.$trigger.parents('.' + conf.classes);
		wrapper
			.append( $(conf.$htmlContent).addClass('uiContent') )
			.find('textarea')
			.focus();
				
		// Trigger
		conf.$trigger
			.addClass('on')
			.unbind('click');
		
		// Save action
		if(conf.saveButton){
			wrapper.find('input[type=submit]').bind('click', function(event){
				that.save(event, conf);
			})
		};
		
		// Close action
		if(conf.closeButton){
			wrapper.find('a').bind('click', function(event){
				that.hide(event, conf);
			})
		};
		
		conf.$trigger.next().find('textarea').html(conf.$trigger.html());
		conf.$trigger.removeClass(conf.classes);
		that.callbacks(conf, 'show');
		
	};
	
	that.hide = function(event, conf){
		that.prevent(event);
		
		// Editor
		wrapper.find('.uiContent').remove();
		
		// Trigger
		conf.$trigger
			.removeClass('on')
			.addClass(conf.classes)
			.unwrap()
			.bind('click', function(event){
				that.show(event, conf);
			});
			
		that.callbacks(conf, 'hide');
	};
	
	that.save = function(event, conf){
		that.prevent(event);
		// AJAX COMUNICATOR
		conf.$trigger.html( wrapper.find('textarea').val() );// callback edit in place
		that.hide(event, conf);
	};

	return that;
}