;(function($) {

/** 
  * @namespace
  */
window.ui = {

 	instances: {},
 	
	init: function(conf) { ui.factory.start(conf) },

/**
 *	@static @class Factory
 *	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
 *	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
 */	
 	factory: {
/**
 *  @function start
 *	@arguments conf {Object} This is an object parameter with components configuration
 *	@return A collection of object instances
 */ 	
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
 *  @static @class Communicator
 *	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
 *	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
 */	
	communicator: {
/**
 *  @function getComponent
 *  @arguments x {String} Name of the component.
 *  @arguments callback {Function} Callback when component is loaded.
 */
		getComponent: function(x,callback){
			var link = document.createElement('link');
				link.href = 'src/css/' + x + '.css'; // TODO: esta url debería ser absoluta
				link.rel = 'stylesheet';
				link.type = 'text/css';
			var head = document.getElementsByTagName('head')[0].appendChild(link);

			var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = 'src/js/' + x + '.js'; // TODO: esta url debería ser absoluta
				script.onload = function(){ callback(x) } // fire the callback
			document.body.insertBefore(script, document.body.firstChild);
		},
		
/**
 *  @function getContent
 *  @arguments x {String} Name of the component.
 *  @arguments callback {Function} Callback when component is loaded.
 */		
 
		getAjaxContent: function(conf){			
			var result;			
			conf.$htmlContent.html('<div class="loading"></div>');
			
			$.ajax({
				url: conf.content.data,
				type: 'POST', // Because ajax.data is sent everytime
				data: {'x':'x'},
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
		},
	},
	
/**
 *  @static @class Positionator
 *	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
 *	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
 *  @function 
 */	

	positionator: {
		// Vertical & horizontal alignment
		center: function(conf){
			var align = function(){
				conf.$htmlContent.css({
					left: (parseInt(ui.utils.window.width()) - conf.$htmlContent.outerWidth() ) /2,
					top: (parseInt(ui.utils.window.height()) - conf.$htmlContent.outerHeight() ) /2
				})
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
		
		// Tooltip
		follow: function(conf){
			conf.$trigger.bind('mousemove', function(event){
				conf.$htmlContent.css({
					top: event.pageY + 20,
					left: event.pageX - 32
				});
			});
		}
	},

/**
 *	Creates a new Object.
 *  @static @class Represent the abstract class of all ui objects.
 *	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
 *	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
 */	
	PowerConstructor: function(){
		var that = this;
		
		return {
					
			prevent: function(event){
				event.preventDefault();
				event.stopPropagation();
			},
			
			loadContent: function(conf){
				if(typeof conf.content !== 'object' || !conf.content.type ){
					throw('UI: "content" attribute error.'); return;
				}else{
					switch(conf.content.type.toLowerCase()){
						case 'ajax': // data = url
							var result = ui.communicator.getAjaxContent(conf);
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
			
			callbacks: function(conf, when){
				if(conf.callbacks && conf.callbacks[when]) conf.callbacks[when]();
			}
			
		};
	},

/**
 *  @static @class Navigators. Represent the abstract class of all navigators ui objects.
 *  @requires PowerConstructor
 *	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
 *	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
 *  @returns {Object} New Navigators.
 */	
	Navigators: function(){
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
	},

/**
 *  @static @class Floats. Represent the abstract class of all floats ui objects.
 *  @requires PowerConstructor
 *	@author <a href="mailto:leandro.linares@mercadolibre.com">Leandro Linares</a>
 *	@author <a href="mailto:guillermo.paz@mercadolibre.com">Guillermo Paz</a>
 *  @returns {Object} New Floats.
 */
	Floats: function(){
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
			$('<div class="cone"></div>').prependTo(conf.$htmlContent);
		};

		that.show = function(event, conf){
			that.prevent(event);
			//TODO: clearTimers();
			conf.$htmlContent = $('<div>').addClass('article ui' + ui.utils.ucfirst(conf.name));
			conf.$htmlContent.html(that.loadContent(conf)).hide().appendTo('body');

			// Visual configuration
			if(conf.closeButton) createClose(conf);
			if(conf.cone) createCone(conf);
			if(conf.align) ui.positionator[conf.align](conf);
			if(conf.classes) conf.$htmlContent.addClass(conf.classes);

			conf.$htmlContent.fadeIn('normal', function(){ that.callbacks(conf, 'show'); });
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
 *	Editor Components Constructor Pattern
 *	@author
 *	@Contructor
 *	@return
 */	
	Editors: function(){
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
		ucfirst: function(s) { return (s + '').charAt(0).toUpperCase() + s.substr(1); }
	}	
};

})(jQuery);