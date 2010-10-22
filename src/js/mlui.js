;(function($) { 
	
window.ui = {

 	instances: {},
 	
	init: function(conf) { ui.factory.start(conf) },

/**
 *	Factory Pattern
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
 *	
 */		
	utils: {
		body: $("body"),
		window: $(window),
		document: $(document),
		dimmer: {
			on:function() { 
				$("<div>").css({"height":ui.utils.window.height(),"display":"block"}).appendTo("body").fadeIn().addClass("dimmer"); 
			},
			off:function() { 
				$("div.dimmer").fadeOut("fast",function(){ $(this).remove(); }); 
			}
		},
		ucfirst: function (S) { 
			return S.charAt(0).toUpperCase() + S.substr(1); 
		}
	}

}

})(jQuery);
