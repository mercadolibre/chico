;(function($) { 
	
window.ui = {
/**
 *	Factory Pattern
 *	@author 
 *	@param {Object} conf This is an object parameter with components configuration
 *	@throws Object configuration
 *	@Contructor
 *	@return A collection of object instances
 */	
 	instances: {},
 	
	init: function(conf){
		
		if(typeof conf !== 'object'){
			throw('UI: Can\'t start without a configuration.'); return;
		}else{
			// Each configuration
			for(var x in conf){
				// ui[ui.utils.ucfirst(x)] = ui.comunicator({js: x.js}); //Do the magic
	    		var component = ui[ui.utils.ucfirst(x)]; //var component = eval('ui.'+ ucfirst(x));   // FUCK the eval!
				
				// If component configuration is an array, each array. Else each DOM elements with component class
	    		$( ($.isArray(conf[x])) ? conf[x] : '.' + x ).each(function(i,e){
		    		if(!ui.instances[x]) ui.instances[x] = []; // If component instances don't exists, create this like array
	    			e.name = x;
	    			ui.instances[x].push(component(e));
	    		});
	    	};
		}
	},
	
/**
 *	Power Constructor Pattern
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
	PowerConstructor: function(){
		return {
			/*comunicator:function(param){
				ui.comunicator({content: param.uri});
			}*/
		};
	},

/**
 *	Float Components Constructor Pattern
 *	@author 
 *	@Contructor
 *	@return   
 */	
	Floats: function(){
		var that = ui.PowerConstructor(); // Inheritance
		
		var prevent = function(event){
			event.preventDefault();
			event.stopPropagation();
		};
					
		var clearTimers = function(){
			clearTimeout(st);
			clearTimeout(ht);
		};
		
		var loadContent = function(content){
			if(typeof content !== 'object' || !content.type ){
				throw('UI: "content" attribute error.'); return;
			}else{
				switch(content.type.toLowerCase()){
					case 'ajax': // data = url
						var data;
						if(content.data) else 
						//return ui.comunicator({ url:content.data });
						
					break;
					case 'dom': // data = class, id, element
						return $(content.data).html();
					break;
					case 'param': // html code
						return content.data;
					break;
				};
			};
		};
			
		var create = function(conf){
			return $('<div>').addClass('article '+conf.name).html(loadContent(conf.content)).hide().appendTo('body');
		};
		
		that.createClose = function(conf){
			$('<p class="btn close">x</p>').bind('click', function(event){
				if(ui.utils.dimmer.status) ui.utils.dimmer.off();
				that.hide(event, conf);
			}).prependTo($('.' + conf.name));
		};
		
		that.show = function(event, conf){
			prevent(event);
			//clearTimers();			
			var o = create(conf);
			///ui.positioner()
			o.fadeIn();
		};
		
		that.hide = function(event, conf){
			prevent(event);
			//clearTimers();	
			$('.' + conf.name).fadeOut('normal', function(event){ $(this).remove(); });
		};

		return that;
	},

/**
 *	Modal window
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
	Modal: function(conf){
		var that = ui.Floats(); // Inheritance
		if(conf.content.type == 'ajax') conf.content.data = $(conf.trigger).attr('href'); // Content from href/action		
		
		$(conf.trigger).bind('click', function(event){ 
			ui.utils.dimmer.on();
			that.show(event, conf)
			that.createClose(conf); 
		});
		
		return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
	},
	
/**
 *	Context Layer
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
	Layer: function(conf){
		var that = ui.Floats(); // Inheritance
		 
		// Click
		if(conf.event === 'click'){
			$(conf.trigger).css('cursor', 'pointer')
				.bind('click',function(event){
					that.show(event, conf);
					that.createClose(conf);					
				});
		// Hover
		/*}else{
			$(t).css('cursor', 'default')
				.bind('mouseover', setShowTimer)
				.bind('mouseout', setHideTimer);*/
		};		
	},

/**
 *	Utilities
 *	@author 
 */		
	utils: {
		body: $('body'),
		window: $(window),
		document: $(document),
		dimmer: {
			status: false,
			on:function(){ 
				$('<div>').bind('click', ui.utils.dimmer.off).addClass('dimmer').css({height:$(window).height(), display:'block'}).hide().appendTo('body').fadeIn();
				ui.utils.dimmer.status = true;
			},
			off:function(){
				$('div.dimmer').fadeOut('fast', function(){ $(this).remove(); });
				ui.utils.dimmer.status = false;
			}
		},
		ucfirst: function(s){
			s += '';
			return s.charAt(0).toUpperCase() + s.substr(1);
		}
	};	
};

})(jQuery);
