;(function($) {

/** 
  * @namespace
  */
var ui = window.ui = {

    version: "0.4.2",

	mode: "dev", // "dev" or "pub"

	components: "carousel dropdown editInPlace layer modal tabNavigator validator tooltip",

 	instances: {},
 	
	init: function() { 
           
        var fns = ui.components.split(" ");
        var tot = fns.length;
       
        for (var i=0; i<tot; i++) {
            ui.factory("configure",fns[i]);
        }
    },
/**
 *	@static Utils. Common usage functions.
 *	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
 *	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
 */		
    utils: {
		body: $('body'),
		window: $(window),
		document: $(document),
		/**
		 *  @function
		 *  @arguments {String}
		 *  @returns {String} New String with uppercase the first character.
		 */		
		ucfirst: function(s) { return (s + '').charAt(0).toUpperCase() + s.substr(1); 
        }
	}	

}



/**
 *	@static @class Factory
 *	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
 *	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
 */	
ui.factory = function(method, x) {


    /**
     *  @function configure
     *	@arguments conf {Object} This is an object parameter with components configuration
     *	@return A collection of object instances
     */
    switch(method) {

    	case "configure":
		
        var name = ui.utils.ucfirst(x);
        var component = ui[name]; //var component = eval('ui.'+ ucfirst(x));   // FUCK the eval
              
        $.fn[x] = function(options) {
			 
            var that = this;
            var options = options || {};
            
            if (typeof options !== 'object') { 
                alert('UI: ' + x + ' configuration error.'); 
                return 
            };
			
            ui.get("component", x, function(x){ // Send configuration to a component

                if (!ui.instances[x]) ui.instances[x] = []; // If component instances don't exists, create this like array
                               
                that.each(function(i, e){
                    
                    var conf = {};
                        conf.name = x;
                        conf.element = e ;
                        conf.id = i;
                    
                    $.extend( conf , options );

                    // Map the instance and Invoke the constructor
                    ui.instances[x].push(ui[name](conf));
                    
                    //console.log(x + " invoking Constructor...")
                });
                
            });
        }
        
        break;
        
        default:
        
        break;
	}
	
}


/**
	 WIP: ui.get("method", x||conf, callback); 
	   
	   ex. ui.get("component","tooltip",callback); ui.comm("get",{...}
*/

ui.environment = function (mode, config) {
	
	switch (mode) {
	
	case "pub":

		return {
			uri: "http://10.100.34.210:8080/content/chico/"+ ui.version + "/php/",
			css: "css.php?q="+config,
			js: "js.php?q="+config
		}

		break;
	
	case "dev":

		return {
			uri: "",
			css: "src/css/"+config+".css",
			js: "src/js/"+config+".js"
		}

		break;
	
	}
	
}

ui.sources = {};

// nuevo communicator
ui.get = function(method, config, callback) {

    switch(method) {

    	case "component":
    	
    		var url = ui.environment(ui.mode, config);
		    var src = url.uri + url.js;
		    var href = url.uri + url.css;
		  	var head = document.getElementsByTagName("head")[0] || document.documentElement;

   			var link = document.createElement('link');
	    		link.href = href;
    	    	link.rel = 'stylesheet';
	        	link.type = 'text/css';
                               
		   	var script = document.createElement("script");
    			script.src = src;
			
			// check if already exist this script
			
			if (ui.sources[config]) {
				//console.log("Componente "+config+" ya existe pusheo el callback");
				ui.sources[config].callbacks.push(callback);
				if (ui.sources[config].ready) {
					callback(config);
					//console.log("Componente "+config+" ya listo disparo el callback");
				}
				return config;
				
			} else {
					
				//console.log("Creo componente "+config);
				ui.sources[config] = {
					script : script,
					callbacks: [callback],
					ready: false
				}				
			}
				
			// Handle Script loading
			var done = false;

   			// Attach handlers for all browsers
			script.onload = script.onreadystatechange = function() {
	    
	    	if ( !done && (!this.readyState || 
    					this.readyState === "loaded" || this.readyState === "complete") ) {
    					
					done = true; 
		   	
		   			// Compoonent ready to use
					ui.sources[config].ready = true;
		   	
			   		// Fire callbacks TODO marcar cuando se disparan
			   		var callbacks = ui.sources[config].callbacks;
			   		var t = callbacks.length;
			   		
			   		for (var i=0;i<t;i++) {
			   			callbacks[i](config);	
			   		}

										
			   		// Handle memory leak in IE
		   			script.onload = script.onreadystatechange = null;
	   			
			   		if ( head && script.parentNode ) {
		   				head.removeChild( script );
		   			}
				}
			};
                
			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used.
			head.insertBefore( script, head.firstChild );
	    	head.appendChild(link);

	    	return config;
    
    	break;
    
   		case "content":
   			
			var result;
					
			
			
			$.ajax({
				url: config.content.data,
				type: config.ajaxType || 'POST', // Because ajax.data is sent everytime, Solucion temporal por el modal
				data: config.ajaxParams || 'x=x', // Default: send {'x':'x'}, Solucion temporal por el modal
				cache: true,
				async: false, // Because getAjaxContent function returnaba before success and error
				success: function(data){
					result = data;
				},
				error: function(data){
					result = false;
				}
			});
			
			return result;
		
			break;
    
        default:
        
       		break;        
	}
	
}
	
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

/**
 *	Creates a new Object.
 *  Represent the abstract class of all ui objects.
 *	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
 *	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
 */	
ui.PowerConstructor = function(){
		
		var that = this;
		
		return {
					
			prevent: function(event){
				event.preventDefault();
				event.stopPropagation();
			},
			
			loadContent: function(conf){
				if(typeof conf.content !== 'object' || !conf.content.type ){
					alert('UI: "content" attribute error.'); return;
				}else{
					switch(conf.content.type.toLowerCase()){
						case 'ajax': // data = url
							var result = ui.get('content', conf);
							return result || '<p>Error on ajax call</p>';
						break;
						case 'dom': // data = class, id, element
							return $(conf.content.data).html();
						break;
						case 'param': // html code
							return conf.content.data;
						break;
					};
					
				};
			},			
			
			callbacks: function(conf, when, handler){
				if(conf.callbacks && conf.callbacks[when]) conf.callbacks[when]();
			}
			
		};
	}

/**
 *  @static @class Navigators. Represent the abstract class of all navigators ui objects.
 *  @requires PowerConstructor
 *	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
 *	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
 *  @returns {Object} New Navigators.
 */	
ui.Navigators = function(){
		var that = ui.PowerConstructor(); // Inheritance
		
		that.status = false;
			
		that.show = function(event, conf){
			that.prevent(event);
			that.status = true;
			conf.$trigger.addClass('on');
			conf.$htmlContent.show();
			
			that.callbacks(conf, 'show');
		};
		
		that.hide = function(event, conf){
			that.prevent(event);
			that.status = false;
			conf.$trigger.removeClass('on');
			conf.$htmlContent.hide();
			
			that.callbacks(conf, 'hide');
		};		
		
		return that;
	}

/**
 *  @static @class Floats. Represent the abstract class of all floats ui objects.
 *  @requires PowerConstructor
 *	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
 *	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
 *  @returns {Object} New Floats.
 */
ui.Floats = function(){
		var that = ui.PowerConstructor(); // Inheritance

		var clearTimers = function(){
			clearTimeout(st);
			clearTimeout(ht);
		};

		var createClose = function(conf){
			$('<p class="btn close">x</p>').bind('click', function(event){
				that.hide(event, conf);
			}).prependTo(conf.$htmlContent);
		};

		var createCone = function(conf){
			$('<div class="cone' + ((conf.align) ? ' ' + conf.align : '')  + '"></div>').prependTo(conf.$htmlContent);
		};

		that.show = function(event, conf){
			that.prevent(event);
			
			//TODO: clearTimers();
			
			// Visual configuration
			var visualConfig = function(){
				if(conf.closeButton) createClose(conf);
				if(conf.cone) createCone(conf);
				if(conf.align) ui.positionator[conf.align](conf);
				if(conf.classes) conf.$htmlContent.addClass(conf.classes);
			};
			
			conf.$htmlContent = $('<div>').addClass('ui' + ui.utils.ucfirst(conf.name));
			
			if(conf.content.type.toLowerCase() === 'ajax'){
				conf.$htmlContent
					.html('<div class="loading"></div>')
					.hide()
					.appendTo('body')
					.fadeIn('fast');
				
				visualConfig();
					
				conf.$htmlContent.html(that.loadContent(conf));

				visualConfig();

				that.callbacks(conf, 'show');
			}else{
				conf.$htmlContent
					.html(that.loadContent(conf))
					.hide()
					.appendTo('body');
				
				visualConfig();
				
				conf.$htmlContent.fadeIn('fast', function(){ that.callbacks(conf, 'show'); });
			};
		};

		that.hide = function(event, conf){
			that.prevent(event);
			//TODO: clearTimers();
			$('.ui' + ui.utils.ucfirst(conf.name)).fadeOut('fast', function(event){ $(this).remove(); });
			that.callbacks(conf, 'hide');
		};

		return that;
	}
	
/**
 *	Editor Components Constructor Pattern
 *	@author
 *	@Contructor
 *	@return
 */	
ui.Editors = function(){
		var that = ui.PowerConstructor(); // Inheritance
		var wrapper;
		
		that.show = function(event, conf){
			that.prevent(event);
			
			// wrapper
			conf.$trigger.wrap( $('<div class="' + conf.classes + '">') );
			wrapper = conf.$trigger.parents('.' + conf.classes);
			wrapper
				.append( $(conf.$htmlContent).addClass('uiContent') )
				.find('textarea')
				.focus();
					
			// Trigger
			conf.$trigger
				.addClass('on')
				.unbind('click');
			
			// Save action
			if(conf.saveButton){
				wrapper.find('input[type=submit]').bind('click', function(event){
					that.save(event, conf);
				})
			};
			
			// Close action
			if(conf.closeButton){
				wrapper.find('a').bind('click', function(event){
					that.hide(event, conf);
				})
			};
			
			conf.$trigger.next().find('textarea').html(conf.$trigger.html());
			conf.$trigger.removeClass(conf.classes);
			that.callbacks(conf, 'show');
			
		};
		
		that.hide = function(event, conf){
			that.prevent(event);
			
			// Editor
			wrapper.find('.uiContent').remove();
			
			// Trigger
			conf.$trigger
				.removeClass('on')
				.addClass(conf.classes)
				.unwrap()
				.bind('click', function(event){
					that.show(event, conf);
				});
				
			that.callbacks(conf, 'hide');
		};
		
		that.save = function(event, conf){
			that.prevent(event);
			// AJAX COMUNICATOR
			conf.$trigger.html( wrapper.find('textarea').val() );// callback edit in place
			that.hide(event, conf);
		};

		return that;
	}
    
    ui.init();
    
})(jQuery);
