/**
 *	Validator
 *	@author 
 *	@Contructor
 *	@return An interface object
 */

ui.Validator = function(conf){
	var that = ui.PowerConstructor(); // Inheritance
	var formStatus = true;
	var watchers = [];
	
	// Validations
	var validations = {
		text:		function(x){ return x.match(/^([a-zA-Z\s]+)$/m) },
		number:		function(x){ return x.match(/^\d+$/m) },
		email:		function(x){ return x.match(/^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/) },
		url:		function(x){ return x.match(/^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}$/) },
		required:	function(x){ return validations.minChars(x.trim(), 1); },
		min:		function(x, n){ return parseInt(x) >= n }, // Only numbers
		max:		function(x, n){ return parseInt(x) <= n },
		minChars:	function(x, n){ return x.toString().length >= n },
		maxChars:	function(x, n){ return x.toString().length <= n }
	};
	
	// Validate TODO: Refactorizar y unificar switch
	var validate = function($element, messages){
		var value = $element.val();
		var helper = watchers[messages.id].helper;
		var required = !$element.parent().hasClass('required') && !validations.required(value);
		
		var error = function(msg){
			if($element.hasClass('errorField')) helper.hide(); else $element.addClass('errorField'); // If error existed...
			helper.show(msg);
			return false;
		};
		
		for(x in messages){
			if(required) break; // Required validation
			
			switch(x){
				case 'required': case 'text': case 'email': case 'url':
					if(!validations[x](value)) return error(messages[x]);
				break;
				case 'number':
					if(!validations.number(value)) return error(messages.number);
					if($element.attr('min') && !validations.min(value, $element.attr('min'))) return error(messages.min);
					if($element.attr('max') && !validations.max(value, $element.attr('max'))) return error(messages.max);
				break;
				case 'range':
					if( // TODO: validar que sea numerico
						($element.attr('min') && !validations.min(value, $element.attr('min'))) ||
						($element.attr('max') && !validations.max(value, $element.attr('max')))
					) return error(messages.range);
				break;
			};
		};
		
		// Status ok
		$element.removeClass('errorField');
		//if(!required) helper.hide();
		return true;
	};
	
	// Watcher Contructor
	var Watcher = function($element, messages){
		$element.bind('blur', function(){ watchers[messages.id].status = validate($element, messages) }); // Watcher events
		return { status: true, helper: ui.Helper($element) }; // Public members
	};
	
	// Create each Watcher
	var index = 0;
	for(x in conf.fields){
		conf.fields[x].id = index;
		watchers.push(Watcher($(x), conf.fields[x]));
		index ++;
	};
	
	// Form submit
	var submit = function(event){
		that.prevent(event);
		
		// Global validation
		$('.uiValidator').remove();
		formStatus = true;
		$.each(watchers, function(i, e){ if(!e.status) formStatus = false; });
		
		// General error
		if(!formStatus){
			$(conf.element).before('<p class="uiValidator"><span class="ico error">Error: </span> ' + conf.defaults.error + '</p>');
		// General ok
		}else{
			$('.uiValidator').remove();
			// Callback vs. submit
			if(conf.callbacks && conf.callbacks.submit) conf.callbacks.submit(); else conf.element.submit(); // TODO: Refactor callbacks (maybe)
		};
	};
	
	// Form events
	$(conf.element).bind('submit', submit);
	
	// Public members
	return { submit: submit, watchers: watchers };
};


/**
 *	Helper
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.Helper = function($element){
	var that = ui.Floats(); // Inheritance

	// Global configuration
	var conf = {
		name: 'helper',
        $trigger: $element,
		align: 'drop',
		cone: true,
		content: { type: 'param' }
	};
	
	var hide = function(){
		that.hide($.Event(), conf);
	};
	
	var show = function(msg){
		conf.content.data = '<span class="ico error">Error: </span>' + msg;
		that.show($.Event(), conf);
	};
	
	return { show: function(msg){ show(msg) }, hide: hide };
};
