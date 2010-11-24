;(function($) {

/** 
  * @namespace
  */
var ui = window.ui = {

    version: "0.4.2",

	mode: "dev", // "dev" or "pub"

	components: "carousel dropdown editInPlace layer modal tabNavigator tooltip validator",

 	instances: {},
 	
	init: function() { 
     
        ui.components = (window.components) ? ui.components+" "+window.components : ui.components ;

        //ui.factory("create");
        
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

        case "create":
        
            ui.get("all", ui.components, function(){
                    
                var fns = ui.components.split(" ");
                var tot = fns.length;
                for (var i=0; i<tot; i++) {
                    ui.factory("configure",fns[i]);
                }
                    
            });
            
            break;

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
    
            // just create
            create(x);
    /*
            if (ui.instances[x].script) {
                // script already here, just create
                create(x);
            } else {
                // get resurces and call create
                ui.get("component", x, create);
            }
      */      
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
			uri: "php/",
			css: "css.php?q="+config,
			js: "js.php?q="+config
		}

		break;
	
	}
	
}

// nuevo communicator
ui.get = function(method, x, callback) {
    
    switch(method) {

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
        
        case "all":
        
            var c = x.split(" ");
            var x = c.join(",");
           // ui.mode = "pub";
            
    	case "component":

        	var url = ui.environment(ui.mode, x);
            var src = url.uri + url.js;
            var href = url.uri + url.css;

   			var style = document.createElement('link');
	    		style.href = href;
    	    	style.rel = 'stylesheet';
	        	style.type = 'text/css';
                               
		   	var script = document.createElement("script");
    			script.src = src;
                        
        default:

            var head = document.getElementsByTagName("head")[0] || document.documentElement;

			// Handle Script loading
			var done = false;

   			// Attach handlers for all browsers
			script.onload = script.onreadystatechange = function() {
	    
	    	if ( !done && (!this.readyState || 
    					this.readyState === "loaded" || this.readyState === "complete") ) {
    					
					done = true; 
                    
                    // save the script and style reference on the instances map
                    if (method == "all") {
                        for (var i=0;i<c.length;i++) {
                            ui.instances[c[i]] = [];
                            ui.instances[c[i]].script = script;
                            ui.instances[c[i]].style = style;
                        }
                    } else {
                        ui.instances[x].script = script;
                        ui.instances[x].style = style;   
                    }
             
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

/**
 *	Carousel
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.Carousel = function(conf){
	var that = ui.PowerConstructor(); // Inheritance
	var status = false;

	// Global configuration
	conf.$trigger = $(conf.element).addClass('uiCarousel');
	conf.$htmlContent = $(conf.element).find('.carousel').addClass('uiContent'); // TODO: wrappear el contenido para que los botones se posicionen con respecto a su contenedor

	// UL Width calculator
	var htmlElementMargin = ($.browser.msie && $.browser.version == '6.0') ? 21 : 20;//IE necesita 1px de más
	var htmlContentWidth = conf.$htmlContent.children().size() * (conf.$htmlContent.children().outerWidth() + htmlElementMargin);
	
	// UL configuration
	conf.$htmlContent
		.wrap($('<div>').addClass('mask'))//gracias al que esta abajo puedo leer el $mask.width()
		.css('width', htmlContentWidth);
		
	// Mask Object	
	var $mask = conf.$trigger.find('.mask');

	// Steps = (width - marginMask / elementWidth + elementMargin)
	var steps = ~~( (conf.$trigger.width() - 70) / (conf.$htmlContent.children().outerWidth() + 20));
		steps = (steps == 0) ? 1 : steps;	

	// Move to... (steps in pixels)
	var moveTo = (conf.$htmlContent.children().outerWidth() + 20) * steps;

	// Mask configuration
	var margin = ($mask.width()-moveTo) / 2;
	$mask.width( moveTo ).height( conf.$htmlContent.children().outerHeight() );
	if(conf.arrows != false) $mask.css('marginLeft', margin);
	
	var prev = function(event){
		if(status) return;//prevButton.css('display') === 'none' limit public movement
		
		var htmlContentPosition = conf.$htmlContent.position();
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left + moveTo }, function(){
			htmlContentPosition = conf.$htmlContent.position();			
			if(htmlContentPosition.left >= 0) prevButton.hide();
			nextButton.show();
			status = false;
		});
	};
	
	//En IE6 al htmlContentWidth por algun motivo se le suma el doble del width de un elemento (li) y calcula mal el next()
	if($.browser.msie && $.browser.version == '6.0') htmlContentWidth = htmlContentWidth - (conf.$htmlContent.children().outerWidth()*2);
	
	var next = function(event){
		if(status) return;//nextButton.css('display') === 'none' limit public movement
		
		var htmlContentPosition = conf.$htmlContent.position(); // Position before moving
		
		status = true;
		
		conf.$htmlContent.animate({ left: htmlContentPosition.left - moveTo }, function(){
			htmlContentPosition = conf.$htmlContent.position(); // Position after moving
			if(htmlContentPosition.left + htmlContentWidth <= $mask.width()) nextButton.hide();
			prevButton.show();
			status = false;
		});		
	};
	
	// Create buttons
	var prevButton = $('<p>')
		.html('Previous')
		.addClass('prev')
		.bind('click', prev)
		.hide()
		.css('top', (conf.$htmlContent.children().outerHeight() - 57) / 2 + 10); // 57 = button height | 10 = box padding top

	var nextButton = $('<p>')
		.html('Next')
		.addClass('next')
		.bind('click', next)
		.hide()
		.css('top', (conf.$htmlContent.children().outerHeight() - 57) / 2 + 10); // 57 = button height | 10 = box padding top
	
	
	
	if(conf.arrows != false) {
		// Append buttons
		conf.$trigger.prepend(prevButton).append(nextButton);
		// Si el ancho del UL es mayor que el de la mascara, muestra next
		if(htmlContentWidth > $mask.width()){ nextButton.show();}
	};

	return { nxt: function(event){ next(event)}, prv: function(event){ prev(event)} }
};


/**
 *	Dropdown
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.Dropdown = function(conf){
	var that = ui.Navigators(); // Inheritance

	// Global configuration
	$(conf.element).addClass('uiDropdown');
	conf.$trigger = $(conf.element).children(':first');
	conf.$htmlContent = conf.$trigger.next().bind('click', function(event){ event.stopPropagation() });
	
	// Events
	conf.$trigger
		.bind('click', function(event){
			if(that.status){ that.hide(event, conf); return; };
			that.show(event, conf);
		
			// Document events
			$(document).bind('click', function(event){
				that.hide(event, conf);
				$(document).unbind('click');
			});
		})
		.css('cursor','pointer')
		.addClass('uiTrigger')
		.append('<span class="ico down">&raquo;</span>');
	
	// Content
	conf.$htmlContent
		.addClass('uiContent')
		.find('a')
			.bind('click', function(){ that.hide($.Event(), conf) });

	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};

/**
 *	Edit in Place
 *	@author 
 *	@Contructor
 *	@return An interface object
 */

ui.EditInPlace = function(conf){
	var that = ui.Editors(); // Inheritance

	// Global configuration
	conf.$trigger = $(conf.element);
	conf.$htmlContent = '<div><textarea>'+ conf.$trigger.html() + '</textarea><p><input type="submit" value="Guardar" class="btn secondary skin"> <a href="#">Cancelar</a></p></div>';
	conf.saveButton = true;
	conf.closeButton = true;
	conf.classes = 'uiEditInPlace';

	// Events
	conf.$trigger
		.addClass(conf.classes + ' uiTrigger')
		.bind('click', function(event){
			that.show(event, conf);
		});

	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};

/**
 *	Context Layer
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.Layer = function(conf){
	var that = ui.Floats(); // Inheritance

	// Global configuration
	conf.$trigger = $(conf.element);
	conf.align = 'drop';
	conf.cone = true;
	conf.classes = 'box';

	// Click
	if(conf.event === 'click'){
		// Local configuration
		conf.closeButton = true;

		// Trigger events
		conf.$trigger
			.css('cursor', 'pointer')
			.bind('click',function(event){
				$('.uiLayer').remove(); // Clear all helpers
				that.show(event, conf);
				$('.uiLayer').bind('click', function(event){ event.stopPropagation() });
				
				// Document events
				$(document).bind('click', function(event){
					that.hide(event, conf);
					$(document).unbind('click');
				});
			});

	// Hover
	}else{
		// Trigger events
		conf.$trigger
			.css('cursor', 'default')
			.bind('mouseover', function(event){
				$('.uiLayer').remove(); // Clear all helpers
				that.show(event, conf);
			})
			.bind('mouseout', function(event){
				that.hide(event, conf);
			});
	};

	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};

/**
 *	Modal window
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.Modal = function(conf){
	var that = ui.Floats(); // Inheritance
	
	// Global configuration
	conf.$trigger = $(conf.element);
	conf.closeButton = true;
	conf.align = 'center';
	conf.classes = 'box';
	
	conf.ajaxType = 'POST';
	
			
	
	// Methods Privates
	var show = function(event){
		if(conf.content.type.toLowerCase() === 'ajax'){
			conf.content.data = conf.$trigger.attr('href') || conf.$trigger.parents('form').attr('action'); //Se pisaba esta variable porque tiene el mismo class pero content.data diferente. Ejmplo del Type param con contenido distintos pero la misma class (va a traer la del primero)
			conf.ajaxParams = 'x=x';//TODO refactor con el header de ajax
			if(conf.$trigger.attr('type') == 'submit') setAjaxConfig();						
		};
		dimmer.on();
		that.show(event, conf);
		$('.close').bind('click', hide);
	};

	var hide = function(event){
		dimmer.off();
		that.hide(event, conf);
	};

	var setAjaxConfig = function(){
		// Content from href/action						
		if(conf.content.data == '') alert('UI: Modal ajax configuration error.'); //TODO mejorar la expresion de vacio
		conf.ajaxType = conf.$trigger.parents('form').attr('method') || 'POST';
		var serialized = conf.$trigger.parents('form').serialize();
		conf.ajaxParams = conf.ajaxParams + ((serialized != '') ? '&' + serialized : '');
	};

	// Dimmer
	var dimmer = {
		on:function(){
			$('<div>').bind('click', function(event){ hide(event) }).addClass('dimmer').css({height:$(window).height(), display:'block'}).hide().appendTo('body').fadeIn();
		},
		off:function(){
			$('div.dimmer').fadeOut('normal', function(){ $(this).remove(); });
		}
	};
	

	// Events
	conf.$trigger
		.css('cursor', 'pointer')
		.bind('click', function(event){ show(event) });
		

	return { show: function(){ show($.Event()) }, hide: function(){ hide($.Event()) } };
};

/**
 *	Tabs Navigator
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.TabNavigator = function(conf){
	var $triggers = $(conf.element).children(':first').find('a');
	var $htmlContent = $(conf.element).children(':first').next();
	var instances = [];

	// Global configuration
	$(conf.element).addClass('uiTabNavigator');
	$triggers.addClass('uiTrigger');
	$htmlContent.addClass('uiContent box');

	// Starts (Mother is pregnant, and her children born)
	$.each($triggers, function(i, e){
		instances.push(ui.Tab(i, e, conf.id));
	});

	var show = function(event, tab){
		ui.instances.tabNavigator[conf.instance].tabs[tab].shoot(event);
		/* The potato is ready!!
		Use this to execute a specific tab on console (on h1 click)
		$('h1').click(function(event){
			ui.instances.tabNavigator[0].show(event, 2);
		});*/
	};

	return { show: function(event, tab){ show(event, tab) }, tabs: instances };
};


/**
 *	Tab
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.Tab = function(index, element, parent){
	var that = ui.Navigators(); // Inheritance
	var display = element.href.split('#');
	var $tabContent = $(element).parents('.uiTabNavigator').find('#' + display[1]);

	// Global configuration
	that.conf = {
		name: 'tab',
		$trigger: $(element).addClass('uiTrigger')
	};

	var results = function(){
		// If there are a tabContent...
		if($tabContent.attr('id')){
			return $tabContent; 
		
		// If tabContent doesn't exists
		}else{
			// Set ajax configuration
			that.conf.content = {
				type: 'ajax',
				data: element.href
			};
			
			// Create tabContent
			var w = $('<div>').attr('id', 'uiTab' + index);
				w.hide().appendTo( that.conf.$trigger.parents('.uiTabNavigator').find('.uiContent') );
			return w;
		};
	};
	that.conf.$htmlContent = results();

	// Open first tab by default
	if(index == 0){
		that.status = true;
		that.conf.$trigger.addClass('on');
	};

	// Hide all closed tabs
	if(!that.status) that.conf.$htmlContent.hide();

	// Process show event
	that.shoot = function(event){
		that.prevent(event);
		var tabs = ui.instances.tabNavigator[parent].tabs; // All my bros
		if(tabs[index].status) return; // Don't click me if I'm open

		// Hide my open bro
		$.each(tabs, function(i, e){
			if(e.status) e.hide(event, e.conf);
		});

		// Load my content if I'need an ajax request
		if(that.conf.$htmlContent.html() === '') that.conf.$htmlContent.html( that.loadContent(that.conf) );

		// Show me
		that.show(event, that.conf);
	};

	// Events
	that.conf.$trigger.bind('click', that.shoot);

	return that;
}

/**
 *	Tooltip
 *	@author 
 *	@Contructor
 *	@return An interface object
 *  @memberOf ui.Floats
 */

ui.Tooltip = function(conf){
	var that = ui.Floats(); // Inheritance

	conf.name = 'tooltip';
	conf.align = 'drop';
	conf.cone = true;
	conf.content = {
		type: 'param',
		data: conf.element.title
	};
		
	conf.$trigger = $(conf.element)
		.css('cursor', 'default')
		.bind('mouseenter', function(event){
			$(this).attr('title', ''); // IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
			that.show(event, conf);
		})
		.bind('mouseleave', function(event){
			$(this).attr('title', conf.content.data);
			that.hide(event, conf);
		});

	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};

/**
 *	Validator
 *	@author 
 *	@Contructor
 *	@return An interface object
 */

ui.Validator = function(conf){
	var that = ui.PowerConstructor(); // Inheritance
	var formStatus = true;
	var watchers = [];
	
	var removeValidatorError = function(){
		$('.uiValidator').fadeOut('fast', function(){
			$(this).remove();
			$('.uiHelper').each(function(i,e){ $(e).css('top', parseInt($(e).css('top')) - $('.uiValidator').height() - 20); }); // TODO: temp solution
		});
	};
	
	// Validations
	var validations = {
		text:		function(x){ return x.match(/^([a-zA-Z\s]+)$/m) },
		number:		function(x){ return x.match(/^\d+$/m) },
		email:		function(x){ return x.match(/^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/) },
		url:		function(x){ return x.match(/^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}$/) },
		range:		function(x, n1, n2){ return validations.number(x) && validations.min(x, n1) && validations.max(x, n1, n2) },
		required:	function(x){ return validations.minChars($.trim(x), 1); },
		min:		function(x, n){ return parseInt(x) >= n },
		max:		function(x, n1, n2){ return parseInt(x) <= n2 },
		minChars:	function(x, n){ return x.toString().length >= n },
		maxChars:	function(x, n){ return x.toString().length <= n }
	};
	
	// Validate
	var validate = function(id, $element, messages, event){
		var helper = watchers[id].helper;
		
		for(var x in messages){
			// Disabled validation
			if($element.parent().hasClass('disabled') && $element.attr('disabled')) break;
			
			// Not required validation (Si no es obligatorio y el campo esta vacio, esta todo ok)
			if(!$element.parent().hasClass('required') && !validations.required($element.val())) break;
			
			// Status error (cut the flow if it's on submit)
			if(!validations[x]($element.val(), $element.attr('min'), $element.attr('max'))){
				if(event.type === 'blur') return false;
				$element.addClass('error');
				if($('.helper' + id)) helper.hide(); // TODO: refactor del hide del helper
				helper.show(messages[x]);
				return false;
			};
		};
		
		// Status ok
		if($element.hasClass('error')){ // With previous error...
			helper.hide();
			$element.removeClass('error');
		};
		
		if(event.type === 'submit') return true;
		
		// General error checker (only on blur)
		formStatus = true; // Reset general status
		$.each(watchers, function(i, e){ if(i != id && !e.status) formStatus = false }); // Check each watcher status except current watcher, because status is true
		if(formStatus) removeValidatorError(); // Remove top helper if no errors
		return true;
	};
	
	// Watcher Contructor
	var Watcher = function(id, $element, messages){
		$element.bind('blur', function(event){ watchers[id].status = validate(id, $element, messages, event) }); // Watcher events
		return { status: true, helper: ui.Helper(id, $element) }; // Public members
	};
	
	// Create each Watcher TODO: Juntar con "Watcher Constructor" en 1 solo lugar
	for(var x in conf.fields){
		watchers.push(Watcher(watchers.length, $(x), conf.fields[x]));
	};
	
	// Form submit
	var submit = function(event){
		that.prevent(event);
		
		// Reset form status
		if(!formStatus){
			removeValidatorError();
			formStatus = true;
		};
		
		// Validate each field
		var index = 0;
		for(var x in conf.fields){
			// Status error
			if(!validate(index, $(x), conf.fields[x], event)){
				formStatus = false;
			// Status ok (Field error clean)
			}else{
				$(x).removeClass('error');
				watchers[index].helper.hide();
			};
			index ++;
		};
		
		// General error
		if(!formStatus){
			$(conf.element).before('<p class="uiValidator"><span class="ico error">Error: </span>' + conf.defaults.error + '</p>');
			$('.uiHelper').each(function(i,e){ $(e).css('top', parseInt($(e).css('top')) + $('.uiValidator').height() + 20); }); // TODO: temp solution
		// General ok
		}else{
			removeValidatorError();
			// Callback vs. submit
			if(conf.callbacks && conf.callbacks.submit) conf.callbacks.submit(); else conf.element.submit();
		};
	};
	
	// Form events
	$(conf.element).find('input[type=submit]').unbind('click');
	$(conf.element).bind('submit', submit);
	
	// Public members
	return { submit: submit, watchers: watchers };
};


/**
 *	Helper
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.Helper = function(id, $element){
	var that = ui.Floats(); // Inheritance

	// Global configuration
	var conf = {
		name: 'helper',
        $trigger: $element,
		align: 'right',
		cone: true,
		content: { type: 'param' },
		classes: 'helper' + id
	};
	
	var hide = function(){
		$('.helper' + id).fadeOut('fast', function(event){ $(this).remove(); }); // TODO: refactor del hide (ocultar solamente el que esta activo)
		that.callbacks(conf, 'hide');
	};
	
	var show = function(text){
		conf.content.data = '<span class="ico error">Error: </span>' + text;
		that.show($.Event(), conf);
	};
	
	return { show: function(text){ show(text) }, hide: hide };
};
    
    ui.init();
    
})(jQuery);