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
				throw('UI: Can\'t start without a configuration.'); return;
			}

			ui.factory.conf = conf;

			// Each configuration
			for(var x in conf) {
	    		ui.communicator.getComponent(x,function(x){ ui.factory.configure(x); });
	    	}
 		},
 		
 		configure: function(x) {
 			var component = ui[ui.utils.ucfirst(x)]; //var component = eval('ui.'+ ucfirst(x));   // FUCK the eval!
			// If component configuration is an array, each array. Else each DOM elements with component class
			$( ($.isArray(ui.factory.conf[x])) ? ui.factory.conf[x] : '.' + x ).each(function(i,e){
				if(!ui.instances[x]) ui.instances[x] = []; // If component instances don't exists, create this like array
				e.name = x;
				e.instance = i;
				ui.instances[x].push(component(e));
			});
 		}
 		
 	},
 	
 /**
 *  Communicator Pattern
 */
	communicator: {
		getComponent: function(x,callback) {	
	
			var link = document.createElement("link");
				link.href="src/css/"+x+".css"; //TODO: esta url debería ser absoluta
				link.rel="stylesheet";
				link.type="text/css";
		    var head = document.getElementsByTagName("head")[0].appendChild(link);

			var script = document.createElement("script");
			    script.type = "text/javascript";			    			   
			    script.src = "src/js/"+x+".js"; //TODO: esta url debería ser absoluta
			    script.onload = function(){ callback(x) } // fire the callback
		    document.body.insertBefore(script, document.body.firstChild);
		}
	},
	
 /**
 *  Positionator Pattern
 *	@author 
 *	@throws Object configuration
 *	@Contructor
 *	@return A collection of object instances
 */	

	positionator: {
		// Vertical & horizontal alignment
		center: function(element){			
			var align = function(){
				element.css({
					left: (parseInt($(window).width())-element.outerWidth() ) /2,						
					top: (parseInt($(window).height())-element.outerHeight() ) /2
				})
			};
			align();		
			$(window).bind('resize', align);
		},
		
		// Layer, drop, mega-drop
		drop: function(element, parent){
			var os = parent.offset();
			var align = function(){
				element.css({
					top: os.top+parent.outerHeight()+10,
					left: os.left+(parent.outerWidth()/2)-20
				});
			};
			align();			
			$(window).bind('resize', align);			
		},
		
		// Tooltip
		follow: function(element, parent){					
			parent.bind('mousemove', function(event){
				element.css({
					top: event.pageY+20,
					left: event.pageX-32
				});
			});

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
					
			prevent: function(event){
				event.preventDefault();
				event.stopPropagation();
			},
			
			loadContent: function(content){
				if(typeof content !== 'object' || !content.type ){
					throw('UI: "content" attribute error.'); return;
				}else{

					switch(content.type.toLowerCase()){
						case 'ajax': // data = url
							//TODO: ui.cominicator do the magic						
						break;
						case 'dom': // data = class, id, element
							return $(content.data).html();
						break;
						case 'param': // html code
							return content.data;
						break;
					};
					
				};
			},			
			
			callbacks: function(conf, when){
				if(conf.callbacks) conf.callbacks[when]();
			}
			
		};
	},

/**
 *	Navigator Components Constructor Pattern
 *	@author 
 *	@Contructor
 *	@return   
 */	
	Navigators: function(){
		var that = ui.PowerConstructor(); // Inheritance
		
		that.status = false;
			
		that.show = function(event, conf){
			that.prevent(event);
			that.status = true;
			conf.trigger.addClass('on');
			conf.content.show();
			
			that.callbacks(conf, 'show');
		};
		
		that.hide = function(event, conf){
			that.prevent(event);
			that.status = false;
			conf.trigger.removeClass('on');
			conf.content.hide();
			
			that.callbacks(conf, 'hide');
		};		
		
		return that;
	},

/**
 *	Float Components Constructor Pattern
 *	@author 
 *	@Contructor
 *	@return   
 */	
	Floats: function(){
		var that = ui.PowerConstructor(); // Inheritance
					
		var clearTimers = function(){
			clearTimeout(st);
			clearTimeout(ht);
		};
		
		var createClose = function(element,conf){
			$('<p class="btn close">x</p>').bind('click', function(event){
				that.hide(event, conf);
			}).prependTo(element);			
		};
		
		var createCone = function(element){
			$('<div class="cone"></div>').prependTo(element);
		};
		
		that.show = function(event, conf){
			that.prevent(event);
			//TODO: clearTimers();			
			var element = $('<div>').addClass('article ui' + ui.utils.ucfirst(conf.name)).html(that.loadContent(conf.content)).hide().appendTo('body');
			//visual config
			if(conf.closeButton) createClose(element, conf);
			if(conf.cone) createCone(element);
			if(conf.align) ui.positionator[conf.align](element, $(conf.trigger));
			if(conf.classes) $(element).addClass(conf.classes);
			
			element.fadeIn();
			that.callbacks(conf, 'show');
		};
		
		that.hide = function(event, conf){
			that.prevent(event);
			//TODO: clearTimers();	
			$('.ui' + ui.utils.ucfirst(conf.name)).fadeOut('normal', function(event){ $(this).remove(); });
			that.callbacks(conf, 'hide');
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
		ucfirst: function(s){
			s += '';
			return s.charAt(0).toUpperCase() + s.substr(1);
		}
	}	
};

})(jQuery);
