;(function($) {

/** 
  * @namespace
  */
var ui = window.ui = {

    version: "0.4.2",

	mode: "dev", // "dev" or "pub"

	components: "dropdown layer modal tabNavigator tooltip",

 	instances: {},
 	
	init: function() { 
     
        ui.components = (window.components) ? ui.components+" "+window.components : ui.components ;
console.log(ui.components)
        var fns = ui.components.split(" ");
        var tot = fns.length;
       
        for (var i=0; i<tot; i++) {
            ui.factory("configure",fns[i]);
        }
    },
/**
 *	@static Utils. Common usage functions.
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
 */	
ui.factory = function(method, x, callback) {

    /**
     *  @function configure
     *	@arguments conf {Object} This is an object parameter with components configuration
     *	@return A collection of object instances
     */
    switch(method) {

    	case "configure":

        var results = [];		
        var name = ui.utils.ucfirst(x);

        // If component instances don't exists, create an empty array
        if (!ui.instances[x]) ui.instances[x] = []; 
        
        var create = function(x) { 
            
            // Send configuration to a component trough options object
            $.fn[x] = function(options) {
    			 
                var that = this;
                var options = options || {};
                
                if (typeof options !== 'object') { 
                    alert('UI: ' + x + ' configuration error.'); 
                    return;
                };		
                                
                that.each(function(i, e) {
                    
                    var conf = {};
                        conf.name = x;
                        conf.element = e ;
                        conf.id = i;
                        
                    $.extend( conf , options );
            
                    // Create a component from his constructor
                    var created = ui[name]( conf );
                    
                    // Save results to return the created components    
                    results.push( created );
                        
                    // Map the instance
                    ui.instances[x].push( created );
                    
                });
                
                // return the created components or component   
                return ( results.length > 0 ) ? results : results[0];
            }

                // callback
                if (callback) callback();
                            
        } // end create function

        if (ui.instances[x].script) {
            // script already here, just create
            create(x); console.log(x +"ya existe")
        } else {
            // get resurces and call create
            ui.get("component", x, create);
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

// nuevo communicator
ui.get = function(method, x, callback) {

    switch(method) {

    	case "component":
    	
    		var url = ui.environment(ui.mode, x);
		    var src = url.uri + url.js;
		    var href = url.uri + url.css;
		  	var head = document.getElementsByTagName("head")[0] || document.documentElement;

   			var style = document.createElement('link');
	    		style.href = href;
    	    	style.rel = 'stylesheet';
	        	style.type = 'text/css';
                               
		   	var script = document.createElement("script");
    			script.src = src;
				
			// Handle Script loading
			var done = false;

   			// Attach handlers for all browsers
			script.onload = script.onreadystatechange = function() {
	    
	    	if ( !done && (!this.readyState || 
    					this.readyState === "loaded" || this.readyState === "complete") ) {
    					
					done = true; 
                    
                    // save the script and style reference on the instances map
		   			ui.instances[x].script = script;
		   			ui.instances[x].style = style;
		   			
		   			// fire callback
		   	        callback(x);
										
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
	    	head.appendChild( style );

	    	return x;
    
    	break;
    
   		case "content":
   			
			var result;
					
			x.$htmlContent.html('<div class="loading"></div>');
			
			$.ajax({
				url: x.content.data,
				type: x.ajaxType || 'POST', // Because ajax.data is sent everytime, Solucion temporal por el modal
				data: x.ajaxParams || 'x=x', // Default: send {'x':'x'}, Solucion temporal por el modal
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
				if (event) {
				    event.preventDefault();
    				event.stopPropagation();
    			}
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
			conf.$htmlContent = $('<div>').addClass('ui' + ui.utils.ucfirst(conf.name));
			conf.$htmlContent.html(that.loadContent(conf)).hide().appendTo('body');

			// Visual configuration
			if(conf.closeButton) createClose(conf);
			if(conf.cone) createCone(conf);
			if(conf.align) ui.positionator[conf.align](conf);
			if(conf.classes) conf.$htmlContent.addClass(conf.classes);

			conf.$htmlContent.fadeIn('fast', function(){ that.callbacks(conf, 'show'); });
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
