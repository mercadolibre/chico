/**
 *	Edit in Place
 *	@author 
 *	@Contructor
 *	@return An interface object
 */

ui.editInPlace = function(conf){
	var that = ui.editors(); // Inheritance

	// Global configuration
	conf.$trigger = $(conf.element);
	conf.$htmlContent = '<div><textarea>'+ conf.$trigger.html() + '</textarea><p><input type="submit" value="Guardar" class="btn secondary skin"> <a href="#">Cancelar</a></p></div>';
	conf.saveButton = true;
	conf.closeButton = true;
	conf.classes = 'ui-editInPlace';

	// Events
	conf.$trigger
		.addClass(conf.classes + ' ui-editInPlace-trigger')
		.bind('click', function(event){
			that.show(event, conf);
		});

	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};