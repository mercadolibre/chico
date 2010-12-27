/**
 *	String validations
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.string = function(conf){
	// Inheritance
	var that = ui.watcher();	
	
	// Get my parent
	//that.parent = $(conf.element).parents("form")[0];
	
	// Watcher status
	conf.status = true;
	
	// Validation types
	conf.types = "text,email,url,minLength,maxLength";
	
	// Validation map
	conf.validations = that.getValidations(conf);
	
	// Helper
	conf.reference = $(conf.element);
	that.helper = ui.helper(conf);
	
	// Messages map TODO: uppercase, lowercase, varchar
	var messages = {
		text:		"Usa sólo letras.",
		email:		"Usa el formato nombre@ejemplo.com.",
		url:		"Usa el formato www.sitio.com.",
		minLength:	"Ingresa al menos " + conf.validations.minLength + " caracteres.",
		maxLength:	"El máximo de caracteres es " + conf.validations.maxLength + "."
	};
	
	// Configure messages by parameter (conf vs. default messages)
	for(var msg in conf.messages) messages[msg] = conf.messages[msg];
	conf.messages = messages;
	
	// Conditions map TODO: uppercase, lowercase, varchar
	conf.checkConditions = function(type){
		var value = $(conf.element).val();
		
		var regex = {
			text:		value.match(/^([a-zA-Z\s]+)$/m),
			email:		value.match(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i),
			url:		value.match(/^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}$/), // TODO: No tendria que soportar "www.algo" (sin .com)
			minLength:	value.length >= parseInt(conf.validations.minLength),
			maxLength:	value.length <= parseInt(conf.validations.maxLength)
		};
		
		return regex[type];
	};

	
	// Create the publish object to be returned
    conf.publish = {
    	uid: conf.id,
		element: conf.element,
		status: conf.status,
		and: function(){ return $(conf.element); },
		validations: conf.validations,
		type: "ui.string",
		reset: function(){
			that.reset(conf);
			return conf.publish;
		},
		validate: function(){
			that.validate(conf);
			return conf.publish;
		}
	};
	
	that.getParent(conf); // Get my parent or set it
		
	return conf.publish;
};
