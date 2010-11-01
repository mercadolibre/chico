/**
 *	Tabs Navigator
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.TabNavigator = function(conf){		
	var triggers = $(conf.trigger).children(':first').find('a');	
	var content = $(conf.trigger).children(':first').next();
	var instances = [];	
	
	// Global configuration
	$(conf.trigger).addClass('tabNavigator ' + (conf.orientation || 'horizontal'));
	triggers.addClass('uiTrigger');
	content.addClass('uiContent');
	
	// Starts (Mother is pregnant, and her children born)
	$.each(triggers, function(i,e){
		instances.push(ui.Tab(i,e,conf.instance));
	});
	
	var show = function(event, tab){
		ui.instances.tabNavigator[conf.instance].tabs[tab].shoot(event);
	};
		
	return { show: function(event, tab){ show(event, tab) }, tabs:instances };
};



/*The potato is ready!!
$('h1').click(
	function(event){
	ui.instances.tabNavigator[0].show(event, 2);
});
*/

/**
 *	Tab
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.Tab = function(index, element, parent){	
	var that = ui.Navigators(); // Inheritance		
	var display = element.href.split('#');
	
	that.conf = {
		name: 'tab',
		trigger: $(element),
		content: $(element).parents('.tabNavigator').find('#' + display[1])
	};
	
	that.conf.content.addClass('box');
	
	if(index == 0){
		that.status = true;
		$(element).addClass('on');
	};
	
	that.shoot = function(event){
		var tabs = ui.instances.tabNavigator[parent].tabs;		
		if(tabs[index].status) return;
		// Hide all my bro (because i'know who is my mamma)
		$.each(tabs, function(i, e){
			if(!e.status) return;
			e.hide(event, e.conf);
		});
		that.show(event, that.conf);
	};
	
	$(element).bind('click', that.shoot).addClass('uiTrigger');
		
	// Content
	//that.conf.content.addClass('uiContent');
	if(!that.status) that.conf.content.hide(); // Hide all falses
	
	return that;
}
