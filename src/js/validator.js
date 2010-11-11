/**
 *	Validator
 *	@author 
 *	@Contructor
 *	@return An interface object
 */

/*
<h1>Validator</h1>
<div class="box">
	<form action="http://www.google.com/" class="formulario">
		<fieldset>
			<ol>
				<li>
					<label class="required" for="w1">
						<span>E-mail (REQUERIDO):</span>
						<input type="email" id="w1">
					</label>
				</li>
				<li>
					<label for="w2">
						<span>URL:</span>
						<input type="url" id="w2">
					</label>
				</li>
				<li>
					<label for="w3">
						<span>Numero:</span>
						<input type="number" id="w3" min="20">
					</label>
				</li>
				<li>
					<label for="w4">
						<span>Rango de números:</span>
						<input type="range" id="w4" min="1" max="10">
					</label>
				</li>
				<li>
					<label for="w5">
						<span>Rango de caracteres:</span>
						<input type="text" id="w5">
					</label>
				</li>
			</ol>
		</fieldset>
		<p><input type="submit" value="Submit" class="btn primary"></p>
	</form>
</div>
*/

/*$('.formulario').validator({
	fields: {
		'#w1': {
			required: 'El email es obligatorio.',
			email: 'El email esta mal escrito.'
		},
		
		'#w2': {
			url: 'La URL esta mal escrita.'
		},
		
		'#w3': {
			number: 'El precio debe ser un número.',
			min: 'El precio debe ser mayor a 20.',
		},
		
		'#w4': {
			range: 'El rango debe ser un número entre 1 y 10.'
		}
	}
});*/


ui.Validator = function(conf){
	var that = ui.PowerConstructor(); // Inheritance
	var formStatus;
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
	
	// Validate
	var validate = function($element, messages){
		var value = $element.val();
		
		var error = function(msg){
			// Status error
			$element.addClass('errorField');
			watchers[messages.helper].helper.show(msg);
			return false;
		};
		
		for(x in messages){
			switch(x){
				case 'required':
				case 'text':
				case 'email':
				case 'url':
					if(!validations[x](value)) return error(messages[x]);
				break;
				case 'number':
					if(!validations.number(value)) return error(messages.number);
					if(!validations.min(value)) return error(messages.min);
					if(!validations.max(value)) return error(messages.max);
				break;
				case 'range':
					if(!validations.min(value) || !validations.max(value)) return error(messages.range); // TODO: validar que sea numerico
				break;
			};
		};
		
		// Status ok
		$element.removeClass('errorField');
		watchers[messages.helper].helper.hide();
		return true;
	};
	
	// Watcher Contructor
	var Watcher = function($element, messages){
		var watcherStatus = true;
		$element.bind('blur', function(){ watcherStatus = validate($element, messages) }); // Watcher events
		return { status: watcherStatus, helper: ui.Helper($element) }; // Public members
	};
	
	// Create each field
	var index = 0;
	for(x in conf.fields){
		conf.fields[x].helper = index;
		watchers.push(Watcher($(x), conf.fields[x]));
		index ++;
	};
	
	// Form submit
	var submit = function(event){
		that.prevent(event);
		
		// magic (recorrer e.status como tabs)
		for(x in watchers){
			console.log(watchers[x].status);
			// if alguno status false meter mensjae arriba
		};
		
		// Callback
		that.callbacks(conf, 'submit');
	};
	
	// Form events
	$(conf.element).bind('submit', submit);

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
        //id: i,
        $trigger: $element,
		align: 'drop',
		cone: true,
		content: { type: 'param' }
	};
	
	var hide = function(){
		that.hide($.Event(), conf);
	};
	
	var show = function(msg){
		//hide(); TODO: Hacer que desaparezca si este tiene contenido
		conf.content.data = msg;
		that.show($.Event(), conf);
	};
	
	return { show: function(msg){ show(msg) }, hide: hide };
};
