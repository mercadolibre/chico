
/**
*  @static @class Positionator
*	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
*	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
*  @function 
*/	

ui.positionator = {
	// Vertical & horizontal alignment
	center: function(conf){
		var align = function(){
			conf.$htmlContent.css({
				left: (parseInt(ui.utils.window.width()) - conf.$htmlContent.outerWidth() ) /2,
				top: ($.browser.msie && $.browser.version == '6.0') ? '' : (parseInt(ui.utils.window.height()) - conf.$htmlContent.outerHeight() ) /2
			});
		};
		align();
		ui.utils.window.bind('resize', align);
	},
	
	// Layer, drop, mega-drop
	drop: function(conf){
		var os = conf.$trigger.offset();
		var align = function(){
			conf.$htmlContent.css({
				top: os.top + conf.$trigger.outerHeight() + 10,
				left: os.left + (conf.$trigger.outerWidth() / 2) - 20
			});
		};
		align();
		ui.utils.window.bind('resize', align);
	},
	
	// Helpers
	right: function(conf){
		var os = conf.$trigger.offset();		
		var align = function(){
			conf.$htmlContent.css({
				top: os.top + (conf.$trigger.outerHeight() / 2) - 11,
				left: os.left + conf.$trigger.outerWidth() + 10
			});
		};
		align();
		ui.utils.window.bind('resize', align);
	},		
	
	// Tooltip
	follow: function(conf){
		conf.$trigger.bind('mousemove', function(event){
			conf.$htmlContent.css({
				top: event.pageY + 20,
				left: event.pageX - 32
			});
		});
	}
}
