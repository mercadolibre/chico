;(function($) { 
	
window.ui = {

 	instances: {},
 	
	init: function(conf) { ui.factory.start(conf) },

/**
 *	Factory Pattern
 *	@author 
 *	@param {Object} conf This is an object parameter with components configuration
 *	@throws Object configuration
 *	@Contructor
 *	@return A collection of object instances
 */	
 	factory: {
 	
		start: function(conf) {
			
			if(typeof conf !== 'object') {
				throw("UI: Can't start without a configuration."); return;
			}

			ui.factory.conf = conf;

			// Each configuration
			for(var x in conf) {
	    		ui.comunicator.getComponent(x,function(x){ ui.factory.configure(x); });
	    	}
 		},
 		
 		configure: function(x) {
 			var component = ui[ui.utils.ucfirst(x)]; //var component = eval('ui.'+ ucfirst(x));   // FUCK the eval!
			// If component configuration is an array, each array. Else each DOM elements with component class
			$( ($.isArray(ui.factory.conf[x])) ? ui.factory.conf[x] : '.' + x ).each(function(i,e){
				if(!ui.instances[x]) ui.instances[x] = []; // If component instances don't exists, create this like array
				e.name = x;
				ui.instances[x].push(component(e));
			});
 		}
 		
 	},
 /**
 *  Comunicator Pattern
 */
	comunicator: {
		getComponent: function(x,c) {	
	
			var link = document.createElement("link");
				link.href="src/css/"+x+".css";
				link.rel="stylesheet";
				link.type="text/css";
		    var head = document.getElementsByTagName("head")[0].appendChild(link);

			var script = document.createElement("script");
			    script.type = "text/javascript";
			    script.src = "src/js/"+x+".js";
			    script.onload = function(){ c(x) } // fire the callback
		    document.body.insertBefore(script, document.body.firstChild);
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
						//if(content.data) else 
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
			return $('<div>').addClass('article ui' + ui.utils.ucfirst(conf.name)).html(loadContent(conf.content)).hide().appendTo('body');
		};
		
		var createClose = function(conf){
			$('<p class="btn close">x</p>').bind('click', function(event){
				if(ui.utils.dimmer.status) ui.utils.dimmer.off();
				that.hide(event, conf);
			}).prependTo($('.ui' + ui.utils.ucfirst(conf.name)));
		};
		
		that.show = function(event, conf){
			prevent(event);
			//clearTimers();			
			var o = create(conf);
			if(conf.closeButton) createClose(conf);
			///ui.positioner()
			o.fadeIn();
		};
		
		that.hide = function(event, conf){
			prevent(event);
			//clearTimers();	
			$('.ui' + ui.utils.ucfirst(conf.name)).fadeOut('normal', function(event){ $(this).remove(); });
		};

		return that;
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
				$('<div>')/*.bind('click', ui.utils.dimmer.off)*/.addClass('dimmer').css({height:$(window).height(), display:'block'}).hide().appendTo('body').fadeIn();
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
	}	
};

})(jQuery);
