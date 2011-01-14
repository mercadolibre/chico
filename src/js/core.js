/** 
  * @namespace
  */
var ui = window.ui = {

    version: "0.4.9",

    components: "",

    internals: "",

    instances: {},
    
    features: {},
 	
    init: function() { 
        // unmark the no-js flag on html tag
        $("html").removeClass("no-js");
        // check for browser support
		ui.features = ui.support();
        // check for pre-configured components
        ui.components = (window.components) ? ui.components+","+window.components : ui.components ;
        // check for pre-configured internals
        ui.internals = (window.internals) ? ui.internals+","+window.internals : ui.internals ;
        // iterate and create components               
        $(ui.components.split(",")).each(function(i,e){ ui.factory({component:e}); });
    },
/**
 *	@static Utils. Common usage functions.
 */		
    utils: {
		body: $('body'),
		html: $('html'),
		window: $(window),
		document: $(document),
		zIndex: 1000,
		index: 0 // global instantiation index
	}
}

/**
*	Factory
*/	
ui.factory = function(o) {

    /**
    *   o {
            component: "chat",
            callback: function(){},
            [script]: "http://..",
            [style]: "http://..",
            [callback]: function(){}    
    *    }
    *
    *	@return A collection of object instances
    */
    
    if (!o) { 
        alert("Factory fatal error: Need and object {component:\"\"} to configure a component."); 
        return;
    };

    if (!o.component) { 
        alert("Factory fatal error: No component defined."); 
        return;
    };

    var x = o.component;

    var create = function(x) { 

        // Send configuration to a component trough options object
        $.fn[x] = function( options ) {

            var results = [];			    
            var that = this;
            var options = options || {};

            that.each( function(i, e) {

                var conf = {};
                    conf.name = x;
                    conf.element = e ;
                    conf.id = ui.utils.index++; // Global instantiation index
                
                // If argument is a number, join with the conf
                if (typeof options === "number") {
                    conf.value = options;
                } else {
                    // Check for an object
                    if (typeof options !== "object") { 
                        alert("Factory " + x + " configure error: Need a basic configuration."); 
                        return;
                    };
                    // Extend conf with the options
                    $.extend( conf , options );   
                }

                // Create a component from his constructor
                var created = ui[x]( conf );

				/* 
					MAPPING INSTANCES
				
    				Internal interface for avoid mapping objects
    				{
    					exists:true,
    					object: {}
    				}
				*/

			    if (created.type) {
			        var type = created.type;		    
                    // If component don't exists in the instances map create an empty array
                    if (!ui.instances[type]) { ui.instances[type] = []; }
                         ui.instances[type].push( created );
			    }
			    		
				if (created.exists) {				
					// Avoid mapping objects that already exists
					created = created.object;
				}			

			    results.push( created );

            });
            
            // return the created components or component   
            return ( results.length > 1 ) ? results : results[0];
        }

        // if a callback is defined 
        if ( o.callback ) { o.callback(); }
                        
    } // end create function
    
    if ( ui[o.component] ) {
        // script already here, just create
        create(o.component);
        
    } else {
        // get resurces and call create
        ui.get({
            "method":"component",
            "component":o.component,
            "script": ( o.script )? o.script : "src/js/"+o.component+".js",
            "styles": ( o.style ) ? o.style : "src/css/"+x+".css",
            "callback":create
        });
        
        //alert("UI: " + x + " configuration error. The component do not exists");
    }
}

/**
 *  Get
 */
 
ui.get = function(o) {
    /**
    *   o {
            method: "content"|"component",
            component: "chat",
            [script]: "http://..",
            [style]: "http://..",
            [callback]: function(){}
    *    }
    */
    
    switch(o.method) {

	case "content":
			
		var result;
        var x = o.conf;
        
		x.$htmlContent.html('<div class="loading"></div>');
				
		$.ajax({
			url: x.ajaxUrl,
			type: x.ajaxType || 'POST', // Because ajax.data is sent everytime, Solucion temporal por el modal
			data: x.ajaxParams,
			cache: true,
			async: false, // Because getAjaxContent function returnaba before success and error
			success: function(data, textStatus, xhr){
				result = data;
				if(x.callbacks && x.callbacks.success) x.callbacks.success(data, textStatus, xhr);			
			},
			error: function(xhr, textStatus, errorThrown){
				result = (x.callbacks && x.callbacks.error) ? x.callbacks.error(xhr, textStatus, errorThrown) : "<p>Error on ajax call</p>";
			}
		});
			
		return result;
	
		break;
        
	case "component":
        
        // ui.get: "Should I get a style?"
        if ( o.style ) {
    		var style = document.createElement('link');
        		style.href = o.style;
    	    	style.rel = 'stylesheet';
            	style.type = 'text/css';
        }
        // ui.get: "Should I get a script?"        
        if ( o.script ) {
    	   	var script = document.createElement("script");
    			script.src = o.script;
        }
        
        var head = document.getElementsByTagName("head")[0] || document.documentElement;

		// Handle Script loading
		var done = false;

		// Attach handlers for all browsers
		script.onload = script.onreadystatechange = function() {
    
    	if ( !done && (!this.readyState || 
					this.readyState === "loaded" || this.readyState === "complete") ) {
					
				done = true;
            
	   			// if callback is defined call it
	   	        if ( o.callback ) { o.callback( o.component ); }
									
		   		// Handle memory leak in IE
	   			script.onload = script.onreadystatechange = null;
   			
		   		if ( head && script.parentNode ) { head.removeChild( script ); }
			}
		};
            
		// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
		// This arises when a base node is used.
		if ( o.script ) { head.insertBefore( script, head.firstChild ); }
		if ( o.style ) { head.appendChild( style ); }
    
		break;        
    }

}

/**
 *  Support
 */
 
ui.support = function() {
	
	// Based on: http://gist.github.com/373874
	// Verify that CSS3 transition is supported (or any of its browser-specific implementations)
	var transition = (function(){
		var thisBody = document.body || document.documentElement;
		var thisStyle = thisBody.style;

		return thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.OTransition !== undefined || thisStyle.transition !== undefined;
	})();
	
	return {
		transition: transition
		// gradient: gradient
	};
	
};
