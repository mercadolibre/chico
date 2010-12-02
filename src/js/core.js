/** 
  * @namespace
  */
var ui = window.ui = {

    version: "0.4.3",

    mode: "dev", // "dev" or "pub"

    components: "carousel, dropdown, layer, modal, tabNavigator, tooltip, validator",

    internals: "position, object, floats, navs",

    instances: {},
 	
    init: function() { 

        if (ui.mode=="dev") {
            var fns = ui.internals.split(", ");
            var tot = fns.length;
            for (var i=0; i<tot; i++) {
                var x = fns[i]; 
                if (!ui[x]) ui.get("internal", x, function(){});
            }
        }
        
        ui.components = (window.components) ? ui.components+" "+window.components : ui.components ;
               
        ui.factory("create");
        
    },
/**
 *	@static Utils. Common usage functions.
 */		
    utils: {
		body: $('body'),
		html: $('html'),
		window: $(window),
		document: $(document),	
		ucfirst: function(s) { return (s + '').charAt(0).toUpperCase() + s.substr(1); 
        }
	}
}

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
    		uri: "src/",
    		css: "css/"+config+".css",
    		js: "js/"+config+".js"
    	}
    
    	break;
    
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

        // The method ui.get("all") DEPRECATED (???)
        //ui.get("all", ui.components, function(){});
        
        var fns = ui.components.split(", ");
        var tot = fns.length;
        for (var i=0; i<tot; i++) {
            var x = fns[i]; 
            ui.factory("configure",x);
        }
    
        break;

	case "configure":

        // If component instances don't exists, create an empty array
        if (!ui.instances[x]) ui.instances[x] = []; 
        
        var create = function(x) { 

            // Send configuration to a component trough options object
            $.fn[x] = function(options) {

                var results = [];			    
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
                    var created = ui[x]( conf );

                    // Save results to return the created components    
                    results.push( created );

                    // Map the instance
                    ui.instances[x].push( created );

                });
                
                // return the created components or component   
                return ( results.length > 1 ) ? results : results[0];
            }

            // callback
            if (callback) callback();
                            
        } // end create function

        if (ui[x]) {
            // script already here, just create
            create(x);
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
*	@static @class Get
*/
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
    
    case "all": // DEPRECATED (???)
    
        var c = x.split(" ");
        var x = c.join(",");

    case "internal":
        
        var internal = true;
        
	case "component":

        if (x.indexOf("http")==-1) {
            var url = ui.environment(ui.mode, x);
            var src = url.uri + url.js;
            var href = url.uri + url.css;
        } else {
            var src = x;    
        }

        if (!internal) {
		var style = document.createElement('link');
    		style.href = href;
	    	style.rel = 'stylesheet';
        	style.type = 'text/css';
        }
        
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
                if (method == "all") { // DEPRECATED (???)
                    for (var i=0;i<c.length;i++) {
                        ui.instances[c[i]] = [];
                        ui.instances[c[i]].script = script;
                        ui.instances[c[i]].style = style;
                    }
                } 
                
                if (!internal) {
                    ui.instances[x].script = script;
                    ui.instances[x].style = style;   
                }
            
	   			// fire callback
	   	        if (callback) callback(x);
									
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
    	if (!internal) head.appendChild( style );

    	return x;
    
		break;        
    }

}

ui.init();
