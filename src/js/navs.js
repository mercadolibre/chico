
/**
*  @static @class Navigators. Represent the abstract class of all navigators ui objects.
*  @requires PowerConstructor
*  @returns {Object} New Navigators.
*/	
ui.navs = function(){
	var that = ui.object(); // Inheritance
	
	that.status = false;
		
	that.show = function(event, conf){
		that.prevent(event);
		that.status = true;
		conf.$trigger.addClass('ch-' + conf.name + '-on');
		conf.$htmlContent.show();
		
		that.callbacks(conf, 'show');
	};
	
	that.hide = function(event, conf){
		that.prevent(event);
		that.status = false;
		conf.$trigger.removeClass('ch-' + conf.name + '-on');
		conf.$htmlContent.hide();
		
		that.callbacks(conf, 'hide');
	};		
	
	return that;
}
