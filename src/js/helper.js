/**
 *	Helper
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.helper = function(conf){
	var that = ui.floats(); // Inheritance

	// Global configuration
	var _conf = {};
	_conf.name = "helper";
	_conf.$trigger = $(conf.element),
	_conf.cone = true;
	_conf.classes = "helper" + conf.id,
	_conf.visible = false;
	_conf.position = {};
	_conf.position.context = conf.reference;
	_conf.position.offset = "15 0";
	_conf.position.points = "lt rt";

	var hide = function(){
		$('.helper' + conf.id).remove();
		_conf.visible = false;
		that.callbacks(conf, 'hide');
	};
	
	var show = function(text){
		_conf.content = '<p><span class="ico error">Error: </span>' + text + '</p>';		
		that.show($.Event(), _conf);
	};

	return { show: function(text){ show(text) }, hide: hide };
};
