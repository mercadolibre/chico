/**
 *	Helper
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.helper = function(conf){
	var that = ui.floats(); // Inheritance

	// Global configuration
	conf.name = "helper";
	conf.$trigger = $(conf.element),
	conf.cone = true;
	conf.classes = "helper" + conf.id,
	conf.visible = false;
	conf.position = {
   		context: $(conf.element),
        offset: "15 0",
		points: "lt rt"
    }
	
	var hide = function(){
		$('.helper' + conf.id).remove();
		conf.visible = false;
		that.callbacks(conf, 'hide');
	};
	
	var show = function(text){
		conf.content = '<p><span class="ico error">Error: </span>' + text + '</p>';		
		that.show($.Event(), conf);
	};

	return { show: function(text){ show(text) }, hide: hide };
};
