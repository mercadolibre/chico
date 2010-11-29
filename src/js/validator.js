/**
 *	Validator
 *	@author 
 *	@Contructor
 *	@return An interface object
 */

ui.validator = function(conf){
	var that = ui.object(); // Inheritance
	var formStatus = true;
	var watchers = [];
	
	var removeValidatorError = function(){
		$('.uiValidator').fadeOut('fast', function(){
			$(this).remove();
			$('.uiHelper').each(function(i,e){ $(e).css('top', parseInt($(e).css('top')) - $('.uiValidator').height() - 20); }); // TODO: temp solution
		});
	};
	
	// Validations
	var validations = {
		text:		function(x){ return x.match(/^([a-zA-Z\s]+)$/m) },
		number:		function(x){ return x.match(/^\d+$/m) },
		email:		function(x){ return x.match(/^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/) },
		url:		function(x){ return x.match(/^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}$/) },
		range:		function(x, n1, n2){ return validations.number(x) && validations.min(x, n1) && validations.max(x, n1, n2) },
		required:	function(x){ return validations.minChars($.trim(x), 1); },
		min:		function(x, n){ return parseInt(x) >= n },
		max:		function(x, n1, n2){ return parseInt(x) <= n2 },
		minChars:	function(x, n){ return x.toString().length >= n },
		maxChars:	function(x, n){ return x.toString().length <= n }
	};
	
	// Validate
	var validate = function(id, $element, messages, event){
		var helper = watchers[id].helper;
		
		for(var x in messages){
			// Disabled validation
			if($element.parent().hasClass('disabled') && $element.attr('disabled')) break;
			
			// Not required validation (Si no es obligatorio y el campo esta vacio, esta todo ok)
			if(!$element.parent().hasClass('required') && !validations.required($element.val())) break;
			
			// Status error (cut the flow if it's on submit)
			if(!validations[x]($element.val(), $element.attr('min'), $element.attr('max'))){
				if(event.type === 'blur') return false;
				$element.addClass('error');
				if($('.helper' + id)) helper.hide(); // TODO: refactor del hide del helper
				helper.show(messages[x]);
				return false;
			};
		};
		
		// Status ok
		if($element.hasClass('error')){ // With previous error...
			helper.hide();
			$element.removeClass('error');
		};
		
		if(event.type === 'submit') return true;
		
		// General error checker (only on blur)
		formStatus = true; // Reset general status
		$.each(watchers, function(i, e){ if(i != id && !e.status) formStatus = false }); // Check each watcher status except current watcher, because status is true
		if(formStatus) removeValidatorError(); // Remove top helper if no errors
		return true;
	};
	
	// Watcher Contructor
	var Watcher = function(id, $element, messages){
		$element.bind('blur', function(event){ watchers[id].status = validate(id, $element, messages, event) }); // Watcher events
		return { status: true, helper: ui.helper(id, $element) }; // Public members
	};
	
	// Create each Watcher TODO: Juntar con "Watcher Constructor" en 1 solo lugar
	for(var x in conf.fields){
		watchers.push(Watcher(watchers.length, $(x), conf.fields[x]));
	};
	
	// Form submit
	var submit = function(event){
		that.prevent(event);
		
		// Reset form status
		if(!formStatus){
			removeValidatorError();
			formStatus = true;
		};
		
		// Validate each field
		var index = 0;
		for(var x in conf.fields){
			// Status error
			if(!validate(index, $(x), conf.fields[x], event)){
				formStatus = false;
			// Status ok (Field error clean)
			}else{
				$(x).removeClass('error');
				watchers[index].helper.hide();
			};
			index ++;
		};
		
		// General error
		if(!formStatus){
			$(conf.element).before('<p class="uiValidator"><span class="ico error">Error: </span>' + conf.defaults.error + '</p>');
			$('.uiHelper').each(function(i,e){ $(e).css('top', parseInt($(e).css('top')) + $('.uiValidator').height() + 20); }); // TODO: temp solution
		// General ok
		}else{
			removeValidatorError();
			// Callback vs. submit
			if(conf.callbacks && conf.callbacks.submit) conf.callbacks.submit(); else conf.element.submit();
		};
	};
	
	// Form events
	$(conf.element).find('input[type=submit]').unbind('click');
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

ui.helper = function(id, $element){
	var that = ui.floats(); // Inheritance

	// Global configuration
	var conf = {
		name: 'helper',
        $trigger: $element,
		align: 'right',
		cone: true,
		content: { type: 'param' },
		classes: 'helper' + id
	};
	
	var hide = function(){
		$('.helper' + id).fadeOut('fast', function(event){ $(this).remove(); }); // TODO: refactor del hide (ocultar solamente el que esta activo)
		that.callbacks(conf, 'hide');
	};
	
	var show = function(text){
		conf.content.data = '<span class="ico error">Error: </span>' + text;
		that.show($.Event(), conf);
	};
	
	return { show: function(text){ show(text) }, hide: hide };
};
